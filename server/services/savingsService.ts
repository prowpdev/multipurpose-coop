import { db } from '../db/database';
import { AccountingEngine } from './accountingEngine';
import { NumberingService } from './numberingService';

export interface OpenSavingsAccountInput {
  member_id: string;
  product_id: string;
  initial_deposit: number;
  cash_account_id?: string;
  performed_by: string;
  term_months?: number; // for Time Deposits
}

export interface SavingsTransactionInput {
  account_id: string;
  type: 'Deposit' | 'Withdrawal' | 'Interest';
  amount: number;
  date: string;
  cash_account_id?: string;
  reference_no?: string;
  performed_by: string;
  notes?: string;
}

export class SavingsService {
  /**
   * Retrieves all savings accounts with member and product details
   */
  public static getAllAccounts(options?: { branch_id?: string; member_id?: string }) {
    let accounts = db.getTable('savings_accounts');
    if (options?.branch_id && options.branch_id !== 'all') {
      accounts = accounts.filter(a => a.branch_id === options.branch_id);
    }
    if (options?.member_id) {
      accounts = accounts.filter(a => a.member_id === options.member_id);
    }
    return accounts;
  }

  /**
   * Opens a new savings account or time deposit placement
   */
  public static openAccount(input: OpenSavingsAccountInput) {
    const member = db.getTable('members').find(m => m.id === input.member_id);
    if (!member) throw new Error(`Member '${input.member_id}' not found`);

    const product = db.getTable('savings_products').find(p => p.id === input.product_id);
    if (!product) throw new Error(`Savings Product '${input.product_id}' not found`);

    const branch = db.getTable('branches').find(b => b.id === member.branch_id) || db.getTable('branches')[0];
    const branchCode = branch?.code || 'MAIN';

    if (input.initial_deposit < (product.minimum_opening_balance || 0)) {
      throw new Error(`Initial deposit ₱${input.initial_deposit} is below minimum opening balance ₱${product.minimum_opening_balance}`);
    }

    const accountNo = NumberingService.generateNumber('DOC_SAVINGS_ACCT', {
      branch_code: branchCode,
      increment: true
    });

    const accountId = `sav_acc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString().split('T')[0];

    const newAccount = {
      id: accountId,
      account_no: accountNo,
      member_id: member.id,
      member_name: `${member.first_name} ${member.last_name}`,
      branch_id: member.branch_id,
      product_id: product.id,
      product_name: product.name,
      balance: input.initial_deposit,
      interest_rate: product.interest_rate,
      opened_date: now,
      status: 'Active',
      created_at: new Date().toISOString()
    };

    db.insert('savings_accounts', newAccount);

    // Record initial deposit transaction
    const txId = `sav_tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const orNo = NumberingService.generateNumber('DOC_OR', { branch_code: branchCode, increment: true });

    db.insert('savings_transactions', {
      id: txId,
      account_id: accountId,
      member_id: member.id,
      type: 'Deposit',
      amount: input.initial_deposit,
      balance_after: input.initial_deposit,
      reference_no: orNo,
      date: now,
      notes: 'Initial opening deposit',
      performed_by: input.performed_by,
      created_at: new Date().toISOString()
    });

    // Post to General Ledger
    AccountingEngine.post({
      transaction_type: 'SAVINGS_DEPOSIT',
      posting_date: now,
      branch_id: member.branch_id,
      reference_id: orNo,
      description: `Savings Opening Deposit: ${member.first_name} ${member.last_name} (${accountNo})`,
      performed_by: input.performed_by,
      amount_breakdown: {
        total: input.initial_deposit
      },
      subsidiary: {
        type: 'Savings',
        id: accountId
      },
      cash_account_id: input.cash_account_id
    });

    return newAccount;
  }

  /**
   * Processes a deposit, withdrawal, or interest crediting
   */
  public static transact(input: SavingsTransactionInput) {
    const account = db.getTable('savings_accounts').find(a => a.id === input.account_id);
    if (!account) throw new Error(`Savings account '${input.account_id}' not found`);

    if (account.status !== 'Active') {
      throw new Error(`Cannot transact on ${account.status} account`);
    }

    const product = db.getTable('savings_products').find(p => p.id === account.product_id);
    const minBalance = product?.minimum_maintaining_balance || 0;

    let newBalance = Number(account.balance);

    if (input.type === 'Deposit' || input.type === 'Interest') {
      newBalance += Number(input.amount);
    } else if (input.type === 'Withdrawal') {
      if (newBalance - input.amount < minBalance) {
        throw new Error(`Insufficient funds: Balance ₱${newBalance} minus withdrawal ₱${input.amount} falls below maintaining balance ₱${minBalance}`);
      }
      newBalance -= Number(input.amount);
    } else {
      throw new Error(`Invalid transaction type: ${input.type}`);
    }

    newBalance = Number(newBalance.toFixed(2));

    const updatedAccount = {
      ...account,
      balance: newBalance,
      updated_at: new Date().toISOString()
    };

    db.update('savings_accounts', a => a.id === account.id, () => updatedAccount);

    const refNo = input.reference_no || `REF-${Date.now().toString().slice(-6)}`;
    const tx = {
      id: `sav_tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      account_id: account.id,
      member_id: account.member_id,
      type: input.type,
      amount: input.amount,
      balance_after: newBalance,
      reference_no: refNo,
      date: input.date || new Date().toISOString().split('T')[0],
      notes: input.notes || '',
      performed_by: input.performed_by,
      created_at: new Date().toISOString()
    };
    db.insert('savings_transactions', tx);

    // Post to General Ledger
    const transactionType = input.type === 'Withdrawal' ? 'SAVINGS_WITHDRAWAL' : 'SAVINGS_DEPOSIT';
    const posting = AccountingEngine.post({
      transaction_type: transactionType,
      posting_date: input.date || new Date().toISOString().split('T')[0],
      branch_id: account.branch_id,
      reference_id: refNo,
      description: `Savings ${input.type}: ${account.account_no} - ${account.member_name} (₱${input.amount})`,
      performed_by: input.performed_by,
      amount_breakdown: {
        total: input.amount
      },
      subsidiary: {
        type: 'Savings',
        id: account.id
      },
      cash_account_id: input.cash_account_id
    });

    return {
      transaction: tx,
      account: updatedAccount,
      journal_entry: posting.journal_entry
    };
  }
}

import { db } from '../db/database';
import { AccountingEngine } from './accountingEngine';
import { NumberingService } from './numberingService';

export interface PayShareCapitalInput {
  account_id: string;
  amount: number;
  payment_date: string;
  cash_account_id?: string;
  or_number?: string;
  notes?: string;
  performed_by: string;
}

export class ShareCapitalService {
  /**
   * Retrieves all member share capital accounts
   */
  public static getAllAccounts(options?: { branch_id?: string; member_id?: string }) {
    let accounts = db.getTable('share_capital_accounts');
    if (options?.branch_id && options.branch_id !== 'all') {
      accounts = accounts.filter(a => a.branch_id === options.branch_id);
    }
    if (options?.member_id) {
      accounts = accounts.filter(a => a.member_id === options.member_id);
    }
    return accounts;
  }

  /**
   * Subscribes a member to cooperative share capital
   */
  public static subscribe(params: {
    member_id: string;
    subscribed_shares: number;
    par_value?: number;
    performed_by: string;
  }) {
    const member = db.getTable('members').find(m => m.id === params.member_id);
    if (!member) throw new Error(`Member '${params.member_id}' not found`);

    const shareSettings = db.getTable('share_capital_settings')[0] || {
      par_value: 100,
      minimum_subscribed_shares: 50,
      minimum_paid_up_shares: 10
    };

    const parValue = params.par_value || shareSettings.par_value || 100;
    const branch = db.getTable('branches').find(b => b.id === member.branch_id) || db.getTable('branches')[0];
    const branchCode = branch?.code || 'MAIN';

    const accountNo = NumberingService.generateNumber('DOC_SHARE_CAPITAL_ACCT', {
      branch_code: branchCode,
      increment: true
    });

    const accountId = `sc_acc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const subscribedAmount = params.subscribed_shares * parValue;

    const newAccount = {
      id: accountId,
      account_no: accountNo,
      member_id: member.id,
      member_name: `${member.first_name} ${member.last_name}`,
      branch_id: member.branch_id,
      subscribed_shares: params.subscribed_shares,
      subscribed_amount: subscribedAmount,
      paid_shares: 0,
      paid_amount: 0,
      par_value: parValue,
      status: 'Active',
      created_at: new Date().toISOString()
    };

    db.insert('share_capital_accounts', newAccount);
    return newAccount;
  }

  /**
   * Records payment towards subscribed share capital and posts to GL
   */
  public static pay(input: PayShareCapitalInput) {
    const account = db.getTable('share_capital_accounts').find(a => a.id === input.account_id);
    if (!account) throw new Error(`Share capital account '${input.account_id}' not found`);

    const parValue = account.par_value || 100;
    const additionalPaidShares = Math.floor(input.amount / parValue);
    const newPaidAmount = Number(account.paid_amount) + Number(input.amount);
    const newPaidShares = Number(account.paid_shares) + additionalPaidShares;

    const branch = db.getTable('branches').find(b => b.id === account.branch_id) || db.getTable('branches')[0];
    const orNumber = input.or_number || NumberingService.generateNumber('DOC_OR', {
      branch_code: branch?.code || 'MAIN',
      increment: true
    });

    const updatedAccount = {
      ...account,
      paid_amount: newPaidAmount,
      paid_shares: newPaidShares,
      updated_at: new Date().toISOString()
    };

    db.update('share_capital_accounts', a => a.id === account.id, () => updatedAccount);

    // Save transaction
    const txId = `sc_tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const tx = {
      id: txId,
      account_id: account.id,
      member_id: account.member_id,
      amount: input.amount,
      shares_issued: additionalPaidShares,
      or_number: orNumber,
      payment_date: input.payment_date || new Date().toISOString().split('T')[0],
      notes: input.notes || 'Share capital contribution',
      performed_by: input.performed_by,
      created_at: new Date().toISOString()
    };
    db.insert('share_capital_transactions', tx);

    // Post to General Ledger
    const posting = AccountingEngine.post({
      transaction_type: 'SHARE_CAPITAL_CONTRIBUTION',
      posting_date: input.payment_date || new Date().toISOString().split('T')[0],
      branch_id: account.branch_id,
      reference_id: orNumber,
      description: `Share Capital Payment: ${account.account_no} - ${account.member_name} (OR# ${orNumber})`,
      performed_by: input.performed_by,
      amount_breakdown: {
        total: input.amount
      },
      subsidiary: {
        type: 'Member',
        id: account.member_id,
        account_id: account.id
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

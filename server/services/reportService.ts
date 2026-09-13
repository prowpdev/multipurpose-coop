import { db } from '../db/database';

export interface TrialBalanceRow {
  account_id: string;
  account_code: string;
  account_name: string;
  category: string;
  report_group: string;
  normal_balance: string;
  debit: number;
  credit: number;
}

export class ReportService {
  /**
   * Compiles the Cooperative Trial Balance verifying General Ledger equilibrium
   */
  public static getTrialBalance(options?: { branch_id?: string; as_of_date?: string }) {
    const coa = db.getTable('chart_of_accounts').filter(a => a.is_active !== false && a.active !== false);
    let journalLines = db.getTable('journal_lines');
    const journalEntries = db.getTable('journal_entries').filter(j => j.status === 'POSTED');

    // Optional branch filtering
    if (options?.branch_id && options.branch_id !== 'all') {
      const branchEntryIds = new Set(journalEntries.filter(j => j.branch_id === options.branch_id).map(j => j.id));
      journalLines = journalLines.filter(l => branchEntryIds.has(l.journal_entry_id));
    }

    if (options?.as_of_date) {
      const validEntryIds = new Set(
        journalEntries.filter(j => j.posting_date <= options.as_of_date!).map(j => j.id)
      );
      journalLines = journalLines.filter(l => validEntryIds.has(l.journal_entry_id));
    }

    // Accumulate debits and credits per account
    const balances: Record<string, { totalDebit: number; totalCredit: number }> = {};
    coa.forEach(a => {
      balances[a.id] = { totalDebit: 0, totalCredit: 0 };
    });

    journalLines.forEach(l => {
      if (balances[l.account_id]) {
        balances[l.account_id].totalDebit += Number(l.debit) || 0;
        balances[l.account_id].totalCredit += Number(l.credit) || 0;
      }
    });

    const rows: TrialBalanceRow[] = [];
    let grandTotalDebit = 0;
    let grandTotalCredit = 0;

    coa.forEach(acc => {
      const bal = balances[acc.id] || { totalDebit: 0, totalCredit: 0 };
      const net = bal.totalDebit - bal.totalCredit;

      let displayDebit = 0;
      let displayCredit = 0;

      if (acc.normal_balance === 'Debit') {
        if (net >= 0) {
          displayDebit = Number(net.toFixed(2));
        } else {
          displayCredit = Number(Math.abs(net).toFixed(2));
        }
      } else {
        // Normal Credit
        if (net <= 0) {
          displayCredit = Number(Math.abs(net).toFixed(2));
        } else {
          displayDebit = Number(net.toFixed(2));
        }
      }

      if (displayDebit !== 0 || displayCredit !== 0) {
        rows.push({
          account_id: acc.id,
          account_code: acc.account_code || acc.code,
          account_name: acc.name,
          category: acc.category || acc.type || 'Asset',
          report_group: acc.report_group || acc.category || 'Assets',
          normal_balance: acc.normal_balance,
          debit: displayDebit,
          credit: displayCredit
        });
        grandTotalDebit += displayDebit;
        grandTotalCredit += displayCredit;
      }
    });

    grandTotalDebit = Number(grandTotalDebit.toFixed(2));
    grandTotalCredit = Number(grandTotalCredit.toFixed(2));
    const difference = Number(Math.abs(grandTotalDebit - grandTotalCredit).toFixed(2));

    return {
      as_of_date: options?.as_of_date || new Date().toISOString().split('T')[0],
      branch_id: options?.branch_id || 'all',
      total_debit: grandTotalDebit,
      total_credit: grandTotalCredit,
      difference,
      is_balanced: difference < 0.02,
      rows
    };
  }

  /**
   * Generates Balance Sheet (Statement of Financial Condition)
   */
  public static getBalanceSheet(options?: { branch_id?: string; as_of_date?: string }) {
    const tb = this.getTrialBalance(options);
    const rows = tb.rows;

    const assets = rows.filter(r => r.category === 'Asset');
    const liabilities = rows.filter(r => r.category === 'Liability');
    const equity = rows.filter(r => r.category === 'Equity');

    const totalAssets = assets.reduce((sum, r) => sum + (r.debit - r.credit), 0);
    const totalLiabilities = liabilities.reduce((sum, r) => sum + (r.credit - r.debit), 0);

    // Compute Net Surplus from Revenue & Expenses
    const revenues = rows.filter(r => r.category === 'Revenue');
    const expenses = rows.filter(r => r.category === 'Expense');
    const totalRevenue = revenues.reduce((sum, r) => sum + (r.credit - r.debit), 0);
    const totalExpense = expenses.reduce((sum, r) => sum + (r.debit - r.credit), 0);
    const netSurplus = totalRevenue - totalExpense;

    const baseEquity = equity.reduce((sum, r) => sum + (r.credit - r.debit), 0);
    const totalEquity = baseEquity + netSurplus;

    return {
      as_of_date: tb.as_of_date,
      assets: {
        accounts: assets,
        total: Number(totalAssets.toFixed(2))
      },
      liabilities: {
        accounts: liabilities,
        total: Number(totalLiabilities.toFixed(2))
      },
      equity: {
        accounts: equity,
        net_surplus_current_period: Number(netSurplus.toFixed(2)),
        total: Number(totalEquity.toFixed(2))
      },
      total_liabilities_and_equity: Number((totalLiabilities + totalEquity).toFixed(2)),
      is_balanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.05
    };
  }

  /**
   * Generates Income Statement (Statement of Operations)
   */
  public static getIncomeStatement(options?: { branch_id?: string }) {
    const tb = this.getTrialBalance(options);
    const rows = tb.rows;

    const revenues = rows.filter(r => r.category === 'Revenue');
    const expenses = rows.filter(r => r.category === 'Expense');

    const totalRevenue = revenues.reduce((sum, r) => sum + (r.credit - r.debit), 0);
    const totalExpense = expenses.reduce((sum, r) => sum + (r.debit - r.credit), 0);
    const netSurplus = totalRevenue - totalExpense;

    return {
      as_of_date: tb.as_of_date,
      revenues: {
        accounts: revenues,
        total: Number(totalRevenue.toFixed(2))
      },
      expenses: {
        accounts: expenses,
        total: Number(totalExpense.toFixed(2))
      },
      net_surplus: Number(netSurplus.toFixed(2)),
      surplus_distribution_preview: {
        reserve_fund_10_percent: Number((netSurplus * 0.1).toFixed(2)),
        education_fund_5_percent: Number((netSurplus * 0.05).toFixed(2)),
        community_dev_fund_3_percent: Number((netSurplus * 0.03).toFixed(2)),
        optional_fund_7_percent: Number((netSurplus * 0.07).toFixed(2)),
        interest_on_share_capital_and_patronage_75_percent: Number((netSurplus * 0.75).toFixed(2))
      }
    };
  }
}

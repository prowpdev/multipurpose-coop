import { db } from '../db/database';
import { InterestCalculationService } from './interestCalculationService';
import { PaymentAllocationService } from './paymentAllocationService';
import { AccountingEngine } from './accountingEngine';
import { NumberingService } from './numberingService';

export interface OriginateLoanRequest {
  member_id: string;
  product_id: string;
  branch_id?: string;
  principal_amount: number;
  term_months: number;
  payment_frequency?: string;
  disbursement_date: string;
  first_payment_date: string;
  cash_account_id?: string;
  performed_by: string;
  notes?: string;
  custom_interest_rate?: number;
}

export interface LoanRepaymentRequest {
  payment_amount: number;
  payment_date: string;
  cash_account_id?: string;
  payment_method?: string;
  or_number?: string;
  performed_by: string;
  notes?: string;
}

export class LoanService {
  /**
   * Calculates dynamic amortization schedule based on loan product configuration
   */
  public static calculateSchedule(params: {
    product_id: string;
    principal_amount: number;
    term_months: number;
    payment_frequency?: string;
    start_date?: string;
    custom_interest_rate?: number;
  }) {
    const products = db.getTable('loan_products');
    const product = products.find(p => p.id === params.product_id);
    if (!product) {
      throw new Error(`Loan Product '${params.product_id}' not found`);
    }

    const annualRate = params.custom_interest_rate !== undefined ? params.custom_interest_rate : product.annual_interest_rate;
    const frequency = params.payment_frequency || product.payment_frequency || 'Monthly';
    const calculationMethod = product.interest_calculation_method || 'Diminishing Balance';

    const schedule = InterestCalculationService.generateSchedule({
      principal: params.principal_amount,
      annualInterestRate: annualRate,
      termMonths: params.term_months,
      frequency,
      method: calculationMethod,
      startDate: params.start_date || new Date().toISOString().split('T')[0]
    });

    const totalInterest = schedule.reduce((sum, item) => sum + item.interest, 0);
    const totalPrincipal = schedule.reduce((sum, item) => sum + item.principal, 0);
    const totalPayment = schedule.reduce((sum, item) => sum + item.total_payment, 0);

    return {
      product: {
        id: product.id,
        code: product.code,
        name: product.name,
        version: product.version || 1,
        calculation_method: calculationMethod,
        annual_interest_rate: annualRate,
        payment_frequency: frequency
      },
      summary: {
        principal: totalPrincipal,
        total_interest: Number(totalInterest.toFixed(2)),
        total_payable: Number(totalPayment.toFixed(2)),
        installment_count: schedule.length
      },
      schedule
    };
  }

  /**
   * Originates and releases a loan with automated numbering, schedule generation, and GL voucher posting
   */
  public static originate(req: OriginateLoanRequest) {
    const member = db.getTable('members').find(m => m.id === req.member_id);
    if (!member) throw new Error(`Member with ID '${req.member_id}' not found`);

    const product = db.getTable('loan_products').find(p => p.id === req.product_id);
    if (!product) throw new Error(`Loan product with ID '${req.product_id}' not found`);

    const branchId = req.branch_id || member.branch_id || 'branch_tar';
    const branches = db.getTable('branches');
    const branch = branches.find(b => b.id === branchId) || branches[0];
    const branchCode = branch?.code || 'MAIN';

    // Validate principal limits
    if (req.principal_amount < product.min_amount || req.principal_amount > product.max_amount) {
      throw new Error(`Principal ₱${req.principal_amount.toLocaleString()} is outside allowed product limits (₱${product.min_amount} - ₱${product.max_amount})`);
    }

    const annualRate = req.custom_interest_rate !== undefined ? req.custom_interest_rate : product.annual_interest_rate;
    const frequency = req.payment_frequency || product.payment_frequency || 'Monthly';

    // Generate schedule
    const schedule = InterestCalculationService.generateSchedule({
      principal: req.principal_amount,
      annualInterestRate: annualRate,
      termMonths: req.term_months,
      frequency,
      method: product.interest_calculation_method || 'Diminishing Balance',
      startDate: req.first_payment_date || req.disbursement_date
    });

    const totalInterest = schedule.reduce((sum, s) => sum + s.interest, 0);

    // Calculate upfront processing & service fees
    const processingFee = (req.principal_amount * (product.processing_fee_percentage || 0)) / 100;
    const serviceFee = product.service_fee_fixed || 0;
    const totalDeductions = processingFee + serviceFee;
    const netDisbursed = req.principal_amount - totalDeductions;

    // Generate loan account number
    const loanNo = NumberingService.generateNumber('DOC_LOAN_ACCT', {
      branch_code: branchCode,
      increment: true
    });

    const loanId = `loan_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    const newLoan = {
      id: loanId,
      loan_no: loanNo,
      member_id: member.id,
      member_name: `${member.first_name} ${member.last_name}`,
      branch_id: branchId,
      branch_name: branch?.name || 'Main Branch',
      product_id: product.id,
      product_name: product.name,
      product_version: product.version || 1,
      principal_amount: req.principal_amount,
      annual_interest_rate: annualRate,
      interest_calculation_method: product.interest_calculation_method || 'Diminishing Balance',
      term_months: req.term_months,
      payment_frequency: frequency,
      disbursement_date: req.disbursement_date,
      first_payment_date: req.first_payment_date,
      processing_fee: processingFee,
      service_fee: serviceFee,
      net_disbursed_amount: netDisbursed,
      total_interest: Number(totalInterest.toFixed(2)),
      total_amount_due: Number((req.principal_amount + totalInterest).toFixed(2)),
      outstanding_principal: req.principal_amount,
      outstanding_interest: Number(totalInterest.toFixed(2)),
      outstanding_penalties: 0,
      total_paid: 0,
      status: 'Active',
      release_voucher_no: '',
      created_at: new Date().toISOString()
    };

    db.insert('loans', newLoan);

    // Persist amortization schedule rows
    schedule.forEach(s => {
      db.insert('loan_amortization_schedules', {
        id: `sched_${loanId}_${s.installment_no}`,
        loan_id: loanId,
        installment_no: s.installment_no,
        due_date: s.due_date,
        principal_due: s.principal,
        interest_due: s.interest,
        total_due: s.total_payment,
        principal_paid: 0,
        interest_paid: 0,
        penalty_paid: 0,
        balance: s.remaining_balance,
        status: 'Unpaid'
      });
    });

    // Automatically post double-entry disbursement journal voucher
    const posting = AccountingEngine.post({
      transaction_type: 'LOAN_RELEASE',
      posting_date: req.disbursement_date,
      branch_id: branchId,
      reference_id: loanNo,
      description: `Loan Disbursement: ${product.name} to ${member.first_name} ${member.last_name} (${loanNo})`,
      performed_by: req.performed_by,
      amount_breakdown: {
        principal: req.principal_amount,
        fees: totalDeductions,
        total: req.principal_amount
      },
      subsidiary: {
        type: 'Loan',
        id: loanId
      },
      cash_account_id: req.cash_account_id
    });

    if (posting.journal_entry) {
      newLoan.release_voucher_no = posting.journal_entry.voucher_no;
      db.update('loans', l => l.id === loanId, () => newLoan);
    }

    return {
      loan: newLoan,
      schedule,
      accounting_posting: posting
    };
  }

  /**
   * Processes loan payment, allocates funds according to configured priority rules, and posts GL vouchers
   */
  public static repay(loanId: string, req: LoanRepaymentRequest) {
    const loan = db.getTable('loans').find(l => l.id === loanId || l.loan_no === loanId);
    if (!loan) throw new Error(`Loan with ID '${loanId}' not found`);

    if (loan.status === 'Paid') {
      throw new Error(`Loan ${loan.loan_no} is already fully paid.`);
    }

    // Allocate payment
    const allocation = PaymentAllocationService.allocate(loan, req.payment_amount, 'rule_std_waterfall');

    // Generate Official Receipt number
    const branches = db.getTable('branches');
    const branch = branches.find(b => b.id === loan.branch_id) || branches[0];
    const orNumber = req.or_number || NumberingService.generateNumber('DOC_OR', {
      branch_code: branch?.code || 'MAIN',
      increment: true
    });

    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    // Update loan balances
    const newPrincipal = Math.max(0, loan.outstanding_principal - allocation.principal_paid);
    const newInterest = Math.max(0, loan.outstanding_interest - allocation.interest_paid);
    const newPenalties = Math.max(0, (loan.outstanding_penalties || 0) - allocation.penalty_paid);
    const newTotalPaid = (loan.total_paid || 0) + req.payment_amount;
    const isPaidOff = newPrincipal <= 0.01;

    const updatedLoan = {
      ...loan,
      outstanding_principal: Number(newPrincipal.toFixed(2)),
      outstanding_interest: Number(newInterest.toFixed(2)),
      outstanding_penalties: Number(newPenalties.toFixed(2)),
      total_paid: Number(newTotalPaid.toFixed(2)),
      status: isPaidOff ? 'Paid' : 'Active',
      last_payment_date: req.payment_date,
      updated_at: new Date().toISOString()
    };

    db.update('loans', l => l.id === loan.id, () => updatedLoan);

    // Save payment record
    const paymentRecord = {
      id: paymentId,
      loan_id: loan.id,
      member_id: loan.member_id,
      or_number: orNumber,
      payment_date: req.payment_date,
      amount: req.payment_amount,
      principal_portion: allocation.principal_paid,
      interest_portion: allocation.interest_paid,
      penalty_portion: allocation.penalty_paid,
      fees_portion: allocation.fees_paid,
      payment_method: req.payment_method || 'Cash',
      cash_account_id: req.cash_account_id || 'cash_vault_main',
      notes: req.notes || '',
      received_by: req.performed_by,
      created_at: new Date().toISOString()
    };
    db.insert('loan_payments', paymentRecord);

    // Post GL payment voucher
    const posting = AccountingEngine.post({
      transaction_type: 'LOAN_PAYMENT',
      posting_date: req.payment_date,
      branch_id: loan.branch_id,
      reference_id: orNumber,
      description: `Loan Payment: ${loan.loan_no} - ${loan.member_name} (OR# ${orNumber})`,
      performed_by: req.performed_by,
      amount_breakdown: {
        principal: allocation.principal_paid,
        interest: allocation.interest_paid,
        penalty: allocation.penalty_paid,
        fees: allocation.fees_paid,
        total: req.payment_amount
      },
      subsidiary: {
        type: 'Loan',
        id: loan.id
      },
      cash_account_id: req.cash_account_id
    });

    return {
      payment: paymentRecord,
      allocation,
      loan: updatedLoan,
      journal_entry: posting.journal_entry
    };
  }
}

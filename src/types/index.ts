export interface Cooperative {
  id: string;
  name: string;
  registration_no: string;
  tax_identification_number: string;
  address: string;
  email: string;
  phone: string;
  currency: string;
  currency_symbol: string;
  decimal_places: number;
  thousands_separator: string;
  decimal_separator: string;
  fiscal_year_start: string;
  fiscal_year_end: string;
}

export interface Branch {
  id: string;
  cooperative_id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  manager_name: string;
  active: boolean;
}

export interface SystemSetting {
  key: string;
  value: string;
  category: string;
}

export interface FeatureToggle {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
}

export type AccountCategory = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
export type NormalBalance = 'Debit' | 'Credit';

export interface Account {
  id: string;
  account_code: string; // SQL: account_code VARCHAR(20) NOT NULL UNIQUE
  code?: string; // alias for backward compatibility
  name: string; // SQL: name VARCHAR(150) NOT NULL
  category: AccountCategory; // SQL: category ENUM('Asset', 'Liability', 'Equity', 'Revenue', 'Expense')
  type?: AccountCategory | 'Income'; // alias
  normal_balance: NormalBalance; // SQL: normal_balance ENUM('Debit', 'Credit')
  is_active: boolean; // SQL: is_active BOOLEAN DEFAULT TRUE
  active?: boolean; // alias
  parent_account_id?: string | null; // SQL: parent_account_id VARCHAR(50) NULL
  parent_id?: string | null; // alias
  report_group: string; // SQL: report_group VARCHAR(100) NOT NULL
  description?: string; // SQL: description TEXT
  is_control?: boolean;
  has_subsidiary?: boolean;
  created_at?: string;
}

export interface AccountingMapping {
  id: string;
  event_type: string; // SQL: event_type ENUM(...)
  transaction_type?: string; // alias
  name?: string; // alias
  debit_account_id: string; // SQL: debit_account_id VARCHAR(50) NOT NULL
  credit_account_id: string; // SQL: credit_account_id VARCHAR(50) NOT NULL
  description: string; // SQL: description VARCHAR(255)
  is_system?: boolean; // SQL: is_system BOOLEAN DEFAULT FALSE
  updated_at?: string;
}

export interface AccountingPeriod {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'Open' | 'Closed';
  closed_at: string | null;
  closed_by: string | null;
}

export interface NumberingFormat {
  id: string;
  module: string;
  prefix: string;
  pattern: string;
  padding: number; // SQL: padding INT DEFAULT 5
  length?: number; // alias
  next_number: number; // SQL: next_number INT DEFAULT 1
  current_seq?: number; // alias
  branch_specific?: boolean; // SQL: branch_specific BOOLEAN
  include_year?: boolean; // SQL: include_year BOOLEAN
  created_at?: string;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  module: string;
  description: string;
  active: boolean;
}

export interface ApprovalRule {
  id: string;
  workflow_id: string;
  step_order: number; // SQL: step_order INT NOT NULL
  order?: number; // alias
  approver_role: string; // SQL: approver_role VARCHAR(50) NOT NULL
  required_role?: string; // alias
  min_amount: number; // SQL: min_amount DECIMAL(15, 2)
  minimum_amount?: number; // alias
  max_amount: number; // SQL: max_amount DECIMAL(15, 2)
  maximum_amount?: number; // alias
  requires_board_action: boolean; // SQL: requires_board_action BOOLEAN DEFAULT FALSE
  level_name?: string; // alias
  required_approvals?: number; // alias
  active?: boolean;
}

export interface CustomField {
  id: string;
  entity_type: 'Member' | 'Loan' | 'Savings' | 'ShareCapital'; // SQL: entity_type ENUM
  entity?: 'Member' | 'Loan'; // alias
  field_key: string; // SQL: field_key VARCHAR(50) NOT NULL
  field_name?: string; // alias
  label: string; // SQL: label VARCHAR(100) NOT NULL
  field_label?: string; // alias
  field_type: 'Text' | 'Number' | 'Date' | 'Select' | 'Boolean' | 'Phone' | 'Dropdown' | 'Radio' | 'Checkbox' | 'Currency' | 'Email'; // SQL: field_type ENUM
  options: any; // SQL: options JSON / string[]
  is_required: boolean; // SQL: is_required BOOLEAN DEFAULT FALSE
  required?: boolean; // alias
  display_order?: number; // SQL: display_order INT DEFAULT 0
  default_value?: string;
  active: boolean;
}

export interface MemberType {
  id: string;
  code: string;
  name: string;
  description: string;
  membership_fee: number;
  min_share_capital: number;
  savings_requirement: number;
  loan_eligibility: boolean;
  required_documents: string[];
  active: boolean;
}

export interface Member {
  id: string;
  member_no: string;
  branch_id: string;
  branch_name?: string;
  member_type_id: string;
  member_type_name?: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  gender: string;
  birthdate: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  joined_date: string;
  custom_field_values: Record<string, any>;
}

export interface LoanProduct {
  id: string;
  code: string;
  name: string;
  description: string;
  version: number;
  min_amount: number;
  max_amount: number;
  annual_interest_rate: number;
  interest_calculation_method: string;
  default_term_months: number;
  payment_frequency: string;
  grace_period_days: number;
  processing_fee_percentage: number;
  service_fee_fixed: number;
  penalty_rule_id: string;
  collateral_required: boolean;
  guarantor_required: boolean;
  debit_account_id: string;
  required_documents: string[];
  approval_workflow_id: string;
  active: boolean;
  effective_from: string;
  effective_until: string | null;
}

export interface Loan {
  id: string;
  loan_account_no: string;
  member_id: string;
  member_name?: string;
  member_no?: string;
  loan_product_id: string;
  product_name?: string;
  product_version: number;
  branch_id: string;
  branch_name?: string;
  principal_amount: number;
  annual_interest_rate: number;
  interest_calculation_method: string;
  term_months: number;
  payment_frequency: string;
  disbursement_date: string;
  first_due_date: string;
  maturity_date: string;
  processing_fee: number;
  service_fee: number;
  net_disbursed: number;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Released' | 'Active' | 'Past Due' | 'Fully Paid';
  current_balance: number;
  total_principal_paid: number;
  total_interest_paid: number;
  total_penalty_paid: number;
  total_fees_paid: number;
  approved_by?: string;
}

export interface SavingsProduct {
  id: string;
  code: string;
  name: string;
  min_balance_to_earn_interest: number;
  annual_interest_rate: number;
  interest_calculation_method: string;
  withdrawal_limit_per_day: number;
  debit_account_id: string;
  active: boolean;
}

export interface SavingsAccount {
  id: string;
  account_number: string;
  member_id: string;
  member_name?: string;
  savings_product_id: string;
  product_name?: string;
  branch_id: string;
  balance: number;
  opened_date: string;
  status: string;
}

export interface ShareCapitalAccount {
  id: string;
  account_number: string;
  member_id: string;
  member_name?: string;
  subscribed_shares: number;
  subscribed_amount: number;
  paid_up_shares: number;
  paid_up_amount: number;
  status: string;
}

export interface CashAccount {
  id: string;
  name: string;
  account_number: string;
  bank_name: string;
  branch_id: string;
  gl_account_id: string;
  opening_balance: number;
  current_balance: number;
  currency: string;
  active: boolean;
}

export interface Fee {
  id: string;
  code: string; // SQL: code VARCHAR(50) NOT NULL UNIQUE
  name: string; // SQL: name VARCHAR(100) NOT NULL
  calculation_type: string; // SQL: calculation_type ENUM('Fixed', 'Percentage')
  amount: number; // SQL: amount DECIMAL(12, 2) NOT NULL
  fixed_amount?: number; // alias
  percentage?: number; // alias
  min_amount?: number;
  max_amount?: number;
  applies_to: 'Loans' | 'Savings' | 'Membership' | 'General'; // SQL: applies_to ENUM('Loans', 'Savings', 'Membership', 'General')
  applicable_module?: string; // alias
  gl_account_id: string; // SQL: gl_account_id VARCHAR(50) NOT NULL
  accounting_account_id?: string; // alias
  active: boolean; // SQL: active BOOLEAN DEFAULT TRUE
  created_at?: string;
}

export interface PenaltyRule {
  id: string;
  name: string; // SQL: name VARCHAR(100) NOT NULL
  grace_period_days: number; // SQL: grace_period_days INT DEFAULT 0
  penalty_rate_percentage: number; // SQL: penalty_rate_percentage DECIMAL(5, 2) NOT NULL
  rate?: number; // alias
  calculation_base: 'Overdue Principal' | 'Overdue Principal and Interest' | 'Total Outstanding Balance'; // SQL: calculation_base ENUM
  calculation_type?: string; // alias
  compounding_frequency: 'None' | 'Daily' | 'Monthly'; // SQL: compounding_frequency ENUM
  calculation_frequency?: string; // alias
  minimum_penalty?: number;
  maximum_penalty?: number;
  gl_income_account_id: string; // SQL: gl_income_account_id VARCHAR(50) NOT NULL
  accounting_account_id?: string; // alias
  active: boolean; // SQL: active BOOLEAN DEFAULT TRUE
}

export interface PaymentAllocationRule {
  id: string;
  name: string;
  priorities: { priority: number; component: string; label?: string }[];
  is_default: boolean;
  active: boolean;
}

export interface JournalEntry {
  id: string;
  voucher_number: string;
  branch_id: string;
  posting_date: string;
  reference_type: string;
  reference_id: string;
  description: string;
  total_debit: number;
  total_credit: number;
  period_id: string;
  status: string;
  created_by: string;
  posted_at: string;
  lines?: JournalLine[];
}

export interface JournalLine {
  id: string;
  journal_entry_id: string;
  account_id: string;
  account_code?: string;
  account_name?: string;
  debit: number;
  credit: number;
  subsidiary_type: string | null;
  subsidiary_id: string | null;
}

export interface ConfigurationAuditTrail {
  id: string;
  setting: string;
  old_value: string;
  new_value: string;
  changed_by: string;
  created_at: string;
  reason: string;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface User {
  id: string;
  name: string;
  username: string;
  role_id: string;
  role_name: string;
  branch_id: string;
}

export interface CoopProfile {
  name: string;
  registration_no?: string;
  currency_code?: string;
  currency_symbol?: string;
  operating_mode?: string;
  tax_exempt?: boolean;
  fiscal_year_start_month?: number;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
}

export interface VerificationTestResult {
  test_id?: number;
  test_number?: number;
  title: string;
  description?: string;
  passed: boolean;
  details: any;
}

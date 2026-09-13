import { DatabaseSchema, db } from './database';
import { initialSeedData } from './seed';

export function generateSampleDataset(): DatabaseSchema {
  // Start from pristine baseline configuration
  const cleanSeed: DatabaseSchema = JSON.parse(JSON.stringify(initialSeedData));

  // 1. Members across 3 branches
  const members = [
    {
      id: 'mem_001',
      member_no: 'MEM-2026-00001',
      branch_id: 'branch_tar',
      branch_name: 'Main Branch - Tarlac',
      member_type_id: 'mt_regular',
      member_type_name: 'Regular Member',
      first_name: 'Juan',
      middle_name: 'Bautista',
      last_name: 'Dela Cruz',
      gender: 'Male',
      birthdate: '1982-05-14',
      civil_status: 'Married',
      phone: '+63 917 555 1201',
      email: 'juan.delacruz@agricoop.ph',
      address: 'Brgy. San Manuel, Tarlac City, Tarlac',
      occupation: 'Rice & Corn Farmer',
      monthly_income: 38000,
      tin_number: '123-456-789-000',
      custom_field_values: {
        farm_hectares: 4.5,
        primary_crop: 'Palay (Rice)',
        monthly_income: '38000',
        tin_number: '123-456-789-000',
        emergency_contact_phone: '+63 917 555 9901'
      },
      joined_date: '2026-01-10',
      active: true,
      membership_status: 'Active',
      created_at: '2026-01-10T08:30:00Z'
    },
    {
      id: 'mem_002',
      member_no: 'MEM-2026-00002',
      branch_id: 'branch_tar',
      branch_name: 'Main Branch - Tarlac',
      member_type_id: 'mt_regular',
      member_type_name: 'Regular Member',
      first_name: 'Maria Clara',
      middle_name: 'Santos',
      last_name: 'Reyes',
      gender: 'Female',
      birthdate: '1987-11-23',
      civil_status: 'Married',
      phone: '+63 920 444 8822',
      email: 'maria.reyes@organicveggies.ph',
      address: 'Poblacion, Victoria, Tarlac',
      occupation: 'Organic Vegetable Producer',
      monthly_income: 42000,
      tin_number: '234-567-890-000',
      custom_field_values: {
        farm_hectares: 2.8,
        primary_crop: 'High-Value Vegetables',
        monthly_income: '42000',
        tin_number: '234-567-890-000',
        emergency_contact_phone: '+63 920 444 9902'
      },
      joined_date: '2026-01-15',
      active: true,
      membership_status: 'Active',
      created_at: '2026-01-15T09:15:00Z'
    },
    {
      id: 'mem_003',
      member_no: 'MEM-2026-00003',
      branch_id: 'branch_urd',
      branch_name: 'Urdaneta Branch',
      member_type_id: 'mt_associate',
      member_type_name: 'Associate Member',
      first_name: 'Rodrigo',
      middle_name: 'Alvarez',
      last_name: 'Mendoza',
      gender: 'Male',
      birthdate: '1991-03-08',
      civil_status: 'Single',
      phone: '+63 918 333 4411',
      email: 'rodrigo.mendoza@agritrading.ph',
      address: 'San Vicente West, Urdaneta City, Pangasinan',
      occupation: 'Agri-Farm Supplies Retailer',
      monthly_income: 32000,
      tin_number: '345-678-901-000',
      custom_field_values: {
        business_nature: 'Fertilizer & Seeds Trading',
        monthly_income: '32000',
        tin_number: '345-678-901-000',
        emergency_contact_phone: '+63 918 333 9903'
      },
      joined_date: '2026-02-01',
      active: true,
      membership_status: 'Active',
      created_at: '2026-02-01T10:00:00Z'
    },
    {
      id: 'mem_004',
      member_no: 'MEM-2026-00004',
      branch_id: 'branch_sfe',
      branch_name: 'San Fernando Branch',
      member_type_id: 'mt_regular',
      member_type_name: 'Regular Member',
      first_name: 'Lourdes',
      middle_name: 'Pineda',
      last_name: 'Ramos',
      gender: 'Female',
      birthdate: '1980-09-19',
      civil_status: 'Widowed',
      phone: '+63 929 111 7733',
      email: 'lourdes.ramos@poultryfarm.ph',
      address: 'Dolores, San Fernando City, Pampanga',
      occupation: 'Poultry & Layer Farm Operator',
      monthly_income: 55000,
      tin_number: '456-789-012-000',
      custom_field_values: {
        farm_hectares: 1.5,
        primary_crop: 'Poultry / Egg Production',
        monthly_income: '55000',
        tin_number: '456-789-012-000',
        emergency_contact_phone: '+63 929 111 9904'
      },
      joined_date: '2026-02-10',
      active: true,
      membership_status: 'Active',
      created_at: '2026-02-10T11:20:00Z'
    },
    {
      id: 'mem_005',
      member_no: 'MEM-2026-00005',
      branch_id: 'branch_tar',
      branch_name: 'Main Branch - Tarlac',
      member_type_id: 'mt_regular',
      member_type_name: 'Regular Member',
      first_name: 'Eduardo',
      middle_name: 'Navarro',
      last_name: 'Manalo',
      gender: 'Male',
      birthdate: '1975-07-30',
      civil_status: 'Married',
      phone: '+63 919 666 5544',
      email: 'eduardo.manalo@sugarcane.ph',
      address: 'Brgy. Matatalaib, Tarlac City, Tarlac',
      occupation: 'Sugarcane Planter',
      monthly_income: 60000,
      tin_number: '567-890-123-000',
      custom_field_values: {
        farm_hectares: 6.0,
        primary_crop: 'Sugarcane',
        monthly_income: '60000',
        tin_number: '567-890-123-000',
        emergency_contact_phone: '+63 919 666 9905'
      },
      joined_date: '2026-02-20',
      active: true,
      membership_status: 'Active',
      created_at: '2026-02-20T14:10:00Z'
    },
    {
      id: 'mem_006',
      member_no: 'MEM-2026-00006',
      branch_id: 'branch_urd',
      branch_name: 'Urdaneta Branch',
      member_type_id: 'mt_youth',
      member_type_name: 'Youth Saver',
      first_name: 'Ana Beatrice',
      middle_name: 'Santos',
      last_name: 'Dizon',
      gender: 'Female',
      birthdate: '2010-12-05',
      civil_status: 'Single',
      phone: '+63 927 888 1122',
      email: 'ana.dizon@student.ph',
      address: 'Pinmaludpod, Urdaneta City, Pangasinan',
      occupation: 'Student / Junior Saver',
      monthly_income: 2000,
      tin_number: '',
      custom_field_values: {
        monthly_income: '2000',
        emergency_contact_phone: '+63 927 888 9906'
      },
      joined_date: '2026-03-01',
      active: true,
      membership_status: 'Active',
      created_at: '2026-03-01T15:00:00Z'
    }
  ];

  // 2. Share Capital Accounts & Initial Contributions
  const shareCapitalAccounts = [
    {
      id: 'sca_001',
      member_id: 'mem_001',
      member_name: 'Juan Bautista Dela Cruz',
      member_no: 'MEM-2026-00001',
      branch_id: 'branch_tar',
      account_number: 'SCA-TAR-00001',
      subscribed_shares: 200,
      subscribed_amount: 20000,
      paid_up_shares: 150,
      paid_up_amount: 15000,
      par_value: 100,
      status: 'Active',
      created_at: '2026-01-10T09:00:00Z'
    },
    {
      id: 'sca_002',
      member_id: 'mem_002',
      member_name: 'Maria Clara Santos Reyes',
      member_no: 'MEM-2026-00002',
      branch_id: 'branch_tar',
      account_number: 'SCA-TAR-00002',
      subscribed_shares: 250,
      subscribed_amount: 25000,
      paid_up_shares: 200,
      paid_up_amount: 20000,
      par_value: 100,
      status: 'Active',
      created_at: '2026-01-15T09:30:00Z'
    },
    {
      id: 'sca_003',
      member_id: 'mem_003',
      member_name: 'Rodrigo Alvarez Mendoza',
      member_no: 'MEM-2026-00003',
      branch_id: 'branch_urd',
      account_number: 'SCA-URD-00001',
      subscribed_shares: 100,
      subscribed_amount: 10000,
      paid_up_shares: 60,
      paid_up_amount: 6000,
      par_value: 100,
      status: 'Active',
      created_at: '2026-02-01T10:15:00Z'
    },
    {
      id: 'sca_004',
      member_id: 'mem_004',
      member_name: 'Lourdes Pineda Ramos',
      member_no: 'MEM-2026-00004',
      branch_id: 'branch_sfe',
      account_number: 'SCA-SFE-00001',
      subscribed_shares: 300,
      subscribed_amount: 30000,
      paid_up_shares: 250,
      paid_up_amount: 25000,
      par_value: 100,
      status: 'Active',
      created_at: '2026-02-10T11:45:00Z'
    },
    {
      id: 'sca_005',
      member_id: 'mem_005',
      member_name: 'Eduardo Navarro Manalo',
      member_no: 'MEM-2026-00005',
      branch_id: 'branch_tar',
      account_number: 'SCA-TAR-00003',
      subscribed_shares: 350,
      subscribed_amount: 35000,
      paid_up_shares: 300,
      paid_up_amount: 30000,
      par_value: 100,
      status: 'Active',
      created_at: '2026-02-20T14:30:00Z'
    }
  ];

  const shareCapitalTransactions = [
    {
      id: 'sctx_001',
      account_id: 'sca_001',
      member_id: 'mem_001',
      branch_id: 'branch_tar',
      transaction_date: '2026-01-10',
      transaction_type: 'Initial Contribution',
      shares: 150,
      amount: 15000,
      reference_no: 'TAR-OR-2026-0001',
      notes: 'Initial Share Capital Contribution upon PMES completion',
      cash_account_id: 'cash_01',
      created_at: '2026-01-10T09:05:00Z'
    },
    {
      id: 'sctx_002',
      account_id: 'sca_002',
      member_id: 'mem_002',
      branch_id: 'branch_tar',
      transaction_date: '2026-01-15',
      transaction_type: 'Initial Contribution',
      shares: 200,
      amount: 20000,
      reference_no: 'TAR-OR-2026-0002',
      notes: 'Paid-up share capital installment',
      cash_account_id: 'cash_01',
      created_at: '2026-01-15T09:35:00Z'
    },
    {
      id: 'sctx_003',
      account_id: 'sca_003',
      member_id: 'mem_003',
      branch_id: 'branch_urd',
      transaction_date: '2026-02-01',
      transaction_type: 'Initial Contribution',
      shares: 60,
      amount: 6000,
      reference_no: 'URD-OR-2026-0001',
      notes: 'Associate member share capital investment',
      cash_account_id: 'cash_05',
      created_at: '2026-02-01T10:20:00Z'
    },
    {
      id: 'sctx_004',
      account_id: 'sca_004',
      member_id: 'mem_004',
      branch_id: 'branch_sfe',
      transaction_date: '2026-02-10',
      transaction_type: 'Initial Contribution',
      shares: 250,
      amount: 25000,
      reference_no: 'SFE-OR-2026-0001',
      notes: 'San Fernando Branch member capital contribution',
      cash_account_id: 'cash_06',
      created_at: '2026-02-10T11:50:00Z'
    },
    {
      id: 'sctx_005',
      account_id: 'sca_005',
      member_id: 'mem_005',
      branch_id: 'branch_tar',
      transaction_date: '2026-02-20',
      transaction_type: 'Initial Contribution',
      shares: 300,
      amount: 30000,
      reference_no: 'TAR-OR-2026-0003',
      notes: 'Paid-up share capital contribution',
      cash_account_id: 'cash_01',
      created_at: '2026-02-20T14:35:00Z'
    }
  ];

  // 3. Savings Accounts & Initial Deposits
  const savingsAccounts = [
    {
      id: 'sav_001',
      account_number: 'SAV-TAR-00001',
      member_id: 'mem_001',
      member_name: 'Juan Bautista Dela Cruz',
      branch_id: 'branch_tar',
      product_id: 'sp_regular',
      product_name: 'Regular Savings Deposit',
      balance: 18500,
      interest_rate: 2.5,
      status: 'Active',
      passbook_number: 'PB-TAR-001',
      opened_date: '2026-01-10',
      created_at: '2026-01-10T09:10:00Z'
    },
    {
      id: 'sav_002',
      account_number: 'SAV-TAR-00002',
      member_id: 'mem_002',
      member_name: 'Maria Clara Santos Reyes',
      branch_id: 'branch_tar',
      product_id: 'sp_regular',
      product_name: 'Regular Savings Deposit',
      balance: 34000,
      interest_rate: 2.5,
      status: 'Active',
      passbook_number: 'PB-TAR-002',
      opened_date: '2026-01-15',
      created_at: '2026-01-15T09:40:00Z'
    },
    {
      id: 'sav_003',
      account_number: 'SAV-URD-00001',
      member_id: 'mem_003',
      member_name: 'Rodrigo Alvarez Mendoza',
      branch_id: 'branch_urd',
      product_id: 'sp_regular',
      product_name: 'Regular Savings Deposit',
      balance: 12500,
      interest_rate: 2.5,
      status: 'Active',
      passbook_number: 'PB-URD-001',
      opened_date: '2026-02-01',
      created_at: '2026-02-01T10:25:00Z'
    },
    {
      id: 'sav_004',
      account_number: 'TD-SFE-00001',
      member_id: 'mem_004',
      member_name: 'Lourdes Pineda Ramos',
      branch_id: 'branch_sfe',
      product_id: 'sp_time_deposit',
      product_name: 'Special Time Deposit (1-Year)',
      balance: 50000,
      interest_rate: 5.5,
      status: 'Active',
      certificate_number: 'TD-CERT-2026-001',
      opened_date: '2026-02-10',
      maturity_date: '2027-02-10',
      created_at: '2026-02-10T12:00:00Z'
    },
    {
      id: 'sav_005',
      account_number: 'SAV-URD-00002',
      member_id: 'mem_006',
      member_name: 'Ana Beatrice Santos Dizon',
      branch_id: 'branch_urd',
      product_id: 'sp_youth',
      product_name: 'Youth Saver Account',
      balance: 3500,
      interest_rate: 3.0,
      status: 'Active',
      passbook_number: 'PB-URD-002',
      opened_date: '2026-03-01',
      created_at: '2026-03-01T15:10:00Z'
    }
  ];

  const savingsTransactions = [
    {
      id: 'savtx_001',
      account_id: 'sav_001',
      member_id: 'mem_001',
      branch_id: 'branch_tar',
      transaction_date: '2026-01-10',
      transaction_type: 'Deposit',
      amount: 18500,
      balance_after: 18500,
      reference_no: 'TAR-OR-2026-0004',
      notes: 'Initial regular savings deposit',
      cash_account_id: 'cash_01',
      created_at: '2026-01-10T09:12:00Z'
    },
    {
      id: 'savtx_002',
      account_id: 'sav_002',
      member_id: 'mem_002',
      branch_id: 'branch_tar',
      transaction_date: '2026-01-15',
      transaction_type: 'Deposit',
      amount: 34000,
      balance_after: 34000,
      reference_no: 'TAR-OR-2026-0005',
      notes: 'Initial savings placement',
      cash_account_id: 'cash_01',
      created_at: '2026-01-15T09:42:00Z'
    },
    {
      id: 'savtx_003',
      account_id: 'sav_003',
      member_id: 'mem_003',
      branch_id: 'branch_urd',
      transaction_date: '2026-02-01',
      transaction_type: 'Deposit',
      amount: 12500,
      balance_after: 12500,
      reference_no: 'URD-OR-2026-0002',
      notes: 'Opening savings balance',
      cash_account_id: 'cash_05',
      created_at: '2026-02-01T10:28:00Z'
    },
    {
      id: 'savtx_004',
      account_id: 'sav_004',
      member_id: 'mem_004',
      branch_id: 'branch_sfe',
      transaction_date: '2026-02-10',
      transaction_type: 'Deposit',
      amount: 50000,
      balance_after: 50000,
      reference_no: 'SFE-OR-2026-0002',
      notes: 'Time deposit placement for 12 months @ 5.5% p.a.',
      cash_account_id: 'cash_06',
      created_at: '2026-02-10T12:05:00Z'
    },
    {
      id: 'savtx_005',
      account_id: 'sav_005',
      member_id: 'mem_006',
      branch_id: 'branch_urd',
      transaction_date: '2026-03-01',
      transaction_type: 'Deposit',
      amount: 3500,
      balance_after: 3500,
      reference_no: 'URD-OR-2026-0003',
      notes: 'Laboratory youth saver initial deposit',
      cash_account_id: 'cash_05',
      created_at: '2026-03-01T15:15:00Z'
    }
  ];

  // 4. Loans & Applications
  const loanApplications = [
    {
      id: 'lapp_001',
      application_no: 'APP-2026-00001',
      member_id: 'mem_001',
      member_name: 'Juan Bautista Dela Cruz',
      branch_id: 'branch_tar',
      product_id: 'lp_agri',
      product_name: 'Agricultural Crop Production Loan',
      product_version: 1,
      amount_requested: 60000,
      term_months: 6,
      payment_frequency: 'Quarterly',
      purpose: 'Palay (Rice) seasonal fertilizers, hybrid seeds, and tractor land preparation',
      status: 'Disbursed',
      applied_date: '2026-01-12',
      reviewed_by: 'Jose Mendoza',
      approved_by: 'Elena Rostro',
      approved_amount: 60000,
      approved_date: '2026-01-14',
      created_at: '2026-01-12T10:00:00Z'
    },
    {
      id: 'lapp_002',
      application_no: 'APP-2026-00002',
      member_id: 'mem_002',
      member_name: 'Maria Clara Santos Reyes',
      branch_id: 'branch_tar',
      product_id: 'lp_regular',
      product_name: 'Regular Multi-Purpose Loan',
      product_version: 1,
      amount_requested: 100000,
      term_months: 12,
      payment_frequency: 'Monthly',
      purpose: 'Expansion of greenhouse organic vegetable irrigation facility',
      status: 'Disbursed',
      applied_date: '2026-01-18',
      reviewed_by: 'Jose Mendoza',
      approved_by: 'Elena Rostro',
      approved_amount: 100000,
      approved_date: '2026-01-20',
      created_at: '2026-01-18T11:00:00Z'
    },
    {
      id: 'lapp_003',
      application_no: 'APP-2026-00003',
      member_id: 'mem_003',
      member_name: 'Rodrigo Alvarez Mendoza',
      branch_id: 'branch_urd',
      product_id: 'lp_emergency',
      product_name: 'Emergency Instant Relief Loan',
      product_version: 1,
      amount_requested: 15000,
      term_months: 6,
      payment_frequency: 'Semi-monthly',
      purpose: 'Medical prescription and emergency clinic assistance',
      status: 'Approved',
      applied_date: '2026-03-02',
      reviewed_by: 'Roberto Valenzuela',
      approved_by: 'Roberto Valenzuela',
      approved_amount: 15000,
      approved_date: '2026-03-03',
      created_at: '2026-03-02T13:30:00Z'
    },
    {
      id: 'lapp_004',
      application_no: 'APP-2026-00004',
      member_id: 'mem_005',
      member_name: 'Eduardo Navarro Manalo',
      branch_id: 'branch_tar',
      product_id: 'lp_agri',
      product_name: 'Agricultural Crop Production Loan',
      product_version: 1,
      amount_requested: 150000,
      term_months: 12,
      payment_frequency: 'Quarterly',
      purpose: 'Sugarcane harvesting labor and milling transport logistics',
      status: 'Under Review',
      applied_date: '2026-03-05',
      reviewed_by: null,
      approved_by: null,
      approved_amount: null,
      approved_date: null,
      created_at: '2026-03-05T09:45:00Z'
    }
  ];

  const loans = [
    {
      id: 'loan_001',
      loan_account_no: 'LN-2026-00001',
      application_id: 'lapp_001',
      member_id: 'mem_001',
      member_name: 'Juan Bautista Dela Cruz',
      branch_id: 'branch_tar',
      product_id: 'lp_agri',
      product_name: 'Agricultural Crop Production Loan',
      product_version: 1,
      principal_amount: 60000,
      annual_interest_rate: 8.0,
      interest_calculation_method: 'Simple Interest',
      term_months: 6,
      payment_frequency: 'Quarterly',
      release_date: '2026-01-15',
      first_payment_date: '2026-04-15',
      maturity_date: '2026-07-15',
      disbursement_voucher_no: 'TAR-CD-2026-0001',
      processing_fee: 900,
      service_fee: 300,
      net_disbursed_amount: 58800,
      current_principal_balance: 60000,
      status: 'Active',
      total_interest_due: 2400,
      interest_balance: 2400,
      created_at: '2026-01-15T10:00:00Z'
    },
    {
      id: 'loan_002',
      loan_account_no: 'LN-2026-00002',
      application_id: 'lapp_002',
      member_id: 'mem_002',
      member_name: 'Maria Clara Santos Reyes',
      branch_id: 'branch_tar',
      product_id: 'lp_regular',
      product_name: 'Regular Multi-Purpose Loan',
      product_version: 1,
      principal_amount: 100000,
      annual_interest_rate: 10.0,
      interest_calculation_method: 'Diminishing Balance',
      term_months: 12,
      payment_frequency: 'Monthly',
      release_date: '2026-01-22',
      first_payment_date: '2026-02-22',
      maturity_date: '2027-01-22',
      disbursement_voucher_no: 'TAR-CD-2026-0002',
      processing_fee: 2000,
      service_fee: 250,
      net_disbursed_amount: 97750,
      current_principal_balance: 91666.67, // 1st installment paid
      status: 'Active',
      total_interest_due: 5499.08,
      interest_balance: 4665.75,
      created_at: '2026-01-22T14:00:00Z'
    }
  ];

  // 5. Loan Amortization Schedules
  const loanSchedules = [
    // Loan 001 - 2 Quarterly installments
    {
      id: 'sched_001_1',
      loan_id: 'loan_001',
      installment_no: 1,
      due_date: '2026-04-15',
      principal_due: 30000,
      interest_due: 1200,
      total_due: 31200,
      principal_paid: 0,
      interest_paid: 0,
      status: 'Pending',
      remaining_balance: 30000
    },
    {
      id: 'sched_001_2',
      loan_id: 'loan_001',
      installment_no: 2,
      due_date: '2026-07-15',
      principal_due: 30000,
      interest_due: 1200,
      total_due: 31200,
      principal_paid: 0,
      interest_paid: 0,
      status: 'Pending',
      remaining_balance: 0
    },
    // Loan 002 - Monthly installments (1st installment paid)
    {
      id: 'sched_002_1',
      loan_id: 'loan_002',
      installment_no: 1,
      due_date: '2026-02-22',
      principal_due: 8333.33,
      interest_due: 833.33,
      total_due: 9166.66,
      principal_paid: 8333.33,
      interest_paid: 833.33,
      status: 'Paid',
      paid_at: '2026-02-21T10:30:00Z',
      remaining_balance: 91666.67
    },
    {
      id: 'sched_002_2',
      loan_id: 'loan_002',
      installment_no: 2,
      due_date: '2026-03-22',
      principal_due: 8333.33,
      interest_due: 763.89,
      total_due: 9097.22,
      principal_paid: 0,
      interest_paid: 0,
      status: 'Pending',
      remaining_balance: 83333.34
    },
    {
      id: 'sched_002_3',
      loan_id: 'loan_002',
      installment_no: 3,
      due_date: '2026-04-22',
      principal_due: 8333.33,
      interest_due: 694.44,
      total_due: 9027.77,
      principal_paid: 0,
      interest_paid: 0,
      status: 'Pending',
      remaining_balance: 75000.01
    }
  ];

  // 6. Loan Repayments & Allocations
  const loanPayments = [
    {
      id: 'pmt_002_1',
      loan_id: 'loan_002',
      loan_account_no: 'LN-2026-00002',
      member_id: 'mem_002',
      member_name: 'Maria Clara Santos Reyes',
      branch_id: 'branch_tar',
      payment_date: '2026-02-21',
      receipt_no: 'TAR-OR-2026-0006',
      total_amount_paid: 9166.66,
      principal_allocated: 8333.33,
      interest_allocated: 833.33,
      penalty_allocated: 0,
      fees_allocated: 0,
      cash_account_id: 'cash_01',
      received_by: 'Maria Gomez',
      notes: 'Prompt payment for Installment #1',
      created_at: '2026-02-21T10:30:00Z'
    }
  ];

  const loanPaymentAllocations = [
    {
      id: 'alloc_002_1_prin',
      payment_id: 'pmt_002_1',
      component: 'Principal',
      amount: 8333.33,
      gl_account_id: 'acc_1210'
    },
    {
      id: 'alloc_002_1_int',
      payment_id: 'pmt_002_1',
      component: 'Interest',
      amount: 833.33,
      gl_account_id: 'acc_4110'
    }
  ];

  // 7. General Ledger Double-Entry Balanced Journal Vouchers
  // All entries strictly balanced Dr = Cr using CDA Chart of Accounts
  const journalEntries = [
    // JV 1: Opening Balances / Initial Bank Capital Injection
    {
      id: 'jv_sample_01',
      voucher_number: 'TAR-JV-2026-000001',
      branch_id: 'branch_tar',
      branch_name: 'Main Branch - Tarlac',
      posting_date: '2026-01-02',
      transaction_type: 'OPENING_BALANCE',
      reference_no: 'CDA-BASELINE-CAPITAL',
      description: 'Opening institutional bank reserves and initial operating liquidity deposit',
      total_debit: 500000,
      total_credit: 500000,
      status: 'Posted',
      created_by: 'Arturo Santos',
      approved_by: 'Elena Rostro',
      created_at: '2026-01-02T08:00:00Z'
    },
    // JV 2: Share Capital Receipts (Juan & Maria Clara)
    {
      id: 'jv_sample_02',
      voucher_number: 'TAR-OR-2026-000001',
      branch_id: 'branch_tar',
      branch_name: 'Main Branch - Tarlac',
      posting_date: '2026-01-10',
      transaction_type: 'SHARE_CAPITAL_PAYMENT',
      reference_no: 'TAR-OR-2026-0001',
      description: 'Paid-up share capital contribution - Juan Dela Cruz',
      total_debit: 15000,
      total_credit: 15000,
      status: 'Posted',
      created_by: 'Maria Gomez',
      approved_by: 'Arturo Santos',
      created_at: '2026-01-10T09:05:00Z'
    },
    {
      id: 'jv_sample_03',
      voucher_number: 'TAR-OR-2026-000002',
      branch_id: 'branch_tar',
      branch_name: 'Main Branch - Tarlac',
      posting_date: '2026-01-15',
      transaction_type: 'SHARE_CAPITAL_PAYMENT',
      reference_no: 'TAR-OR-2026-0002',
      description: 'Paid-up share capital contribution - Maria Clara Reyes',
      total_debit: 20000,
      total_credit: 20000,
      status: 'Posted',
      created_by: 'Maria Gomez',
      approved_by: 'Arturo Santos',
      created_at: '2026-01-15T09:35:00Z'
    },
    // JV 4: Savings Deposits
    {
      id: 'jv_sample_04',
      voucher_number: 'TAR-OR-2026-000004',
      branch_id: 'branch_tar',
      branch_name: 'Main Branch - Tarlac',
      posting_date: '2026-01-10',
      transaction_type: 'SAVINGS_DEPOSIT',
      reference_no: 'TAR-OR-2026-0004',
      description: 'Regular savings deposit - Juan Dela Cruz',
      total_debit: 18500,
      total_credit: 18500,
      status: 'Posted',
      created_by: 'Maria Gomez',
      approved_by: 'Arturo Santos',
      created_at: '2026-01-10T09:12:00Z'
    },
    {
      id: 'jv_sample_05',
      voucher_number: 'TAR-OR-2026-000005',
      branch_id: 'branch_tar',
      branch_name: 'Main Branch - Tarlac',
      posting_date: '2026-01-15',
      transaction_type: 'SAVINGS_DEPOSIT',
      reference_no: 'TAR-OR-2026-0005',
      description: 'Regular savings deposit - Maria Clara Reyes',
      total_debit: 34000,
      total_credit: 34000,
      status: 'Posted',
      created_by: 'Maria Gomez',
      approved_by: 'Arturo Santos',
      created_at: '2026-01-15T09:42:00Z'
    },
    // JV 6: Loan Releases
    {
      id: 'jv_sample_06',
      voucher_number: 'TAR-CD-2026-000001',
      branch_id: 'branch_tar',
      branch_name: 'Main Branch - Tarlac',
      posting_date: '2026-01-15',
      transaction_type: 'LOAN_RELEASE',
      reference_no: 'LN-2026-00001',
      description: 'Disbursement of Agricultural Crop Production Loan - Juan Dela Cruz',
      total_debit: 60000,
      total_credit: 60000,
      status: 'Posted',
      created_by: 'Arturo Santos',
      approved_by: 'Elena Rostro',
      created_at: '2026-01-15T10:00:00Z'
    },
    {
      id: 'jv_sample_07',
      voucher_number: 'TAR-CD-2026-000002',
      branch_id: 'branch_tar',
      branch_name: 'Main Branch - Tarlac',
      posting_date: '2026-01-22',
      transaction_type: 'LOAN_RELEASE',
      reference_no: 'LN-2026-00002',
      description: 'Disbursement of Regular Multi-Purpose Loan - Maria Clara Reyes',
      total_debit: 100000,
      total_credit: 100000,
      status: 'Posted',
      created_by: 'Arturo Santos',
      approved_by: 'Elena Rostro',
      created_at: '2026-01-22T14:00:00Z'
    },
    // JV 8: Loan Repayment (Maria Clara Reyes)
    {
      id: 'jv_sample_08',
      voucher_number: 'TAR-OR-2026-000006',
      branch_id: 'branch_tar',
      branch_name: 'Main Branch - Tarlac',
      posting_date: '2026-02-21',
      transaction_type: 'LOAN_PAYMENT',
      reference_no: 'LN-2026-00002-INST1',
      description: 'Loan installment payment - Maria Clara Reyes (Principal + Interest)',
      total_debit: 9166.66,
      total_credit: 9166.66,
      status: 'Posted',
      created_by: 'Maria Gomez',
      approved_by: 'Arturo Santos',
      created_at: '2026-02-21T10:30:00Z'
    },
    // JV 9: Urdaneta Branch Share Capital & Savings
    {
      id: 'jv_sample_09',
      voucher_number: 'URD-OR-2026-000001',
      branch_id: 'branch_urd',
      branch_name: 'Urdaneta Branch',
      posting_date: '2026-02-01',
      transaction_type: 'SHARE_CAPITAL_PAYMENT',
      reference_no: 'URD-OR-2026-0001',
      description: 'Associate share capital investment - Rodrigo Mendoza',
      total_debit: 6000,
      total_credit: 6000,
      status: 'Posted',
      created_by: 'Cashier Urdaneta',
      approved_by: 'Roberto Valenzuela',
      created_at: '2026-02-01T10:20:00Z'
    },
    {
      id: 'jv_sample_10',
      voucher_number: 'URD-OR-2026-000002',
      branch_id: 'branch_urd',
      branch_name: 'Urdaneta Branch',
      posting_date: '2026-02-01',
      transaction_type: 'SAVINGS_DEPOSIT',
      reference_no: 'URD-OR-2026-0002',
      description: 'Opening savings deposit - Rodrigo Mendoza',
      total_debit: 12500,
      total_credit: 12500,
      status: 'Posted',
      created_by: 'Cashier Urdaneta',
      approved_by: 'Roberto Valenzuela',
      created_at: '2026-02-01T10:28:00Z'
    },
    // JV 11: San Fernando Branch Share Capital & Time Deposit
    {
      id: 'jv_sample_11',
      voucher_number: 'SFE-OR-2026-000001',
      branch_id: 'branch_sfe',
      branch_name: 'San Fernando Branch',
      posting_date: '2026-02-10',
      transaction_type: 'SHARE_CAPITAL_PAYMENT',
      reference_no: 'SFE-OR-2026-0001',
      description: 'Paid-up share capital placement - Lourdes Ramos',
      total_debit: 25000,
      total_credit: 25000,
      status: 'Posted',
      created_by: 'Cashier San Fernando',
      approved_by: 'Carmela Santos',
      created_at: '2026-02-10T11:50:00Z'
    },
    {
      id: 'jv_sample_12',
      voucher_number: 'SFE-OR-2026-000002',
      branch_id: 'branch_sfe',
      branch_name: 'San Fernando Branch',
      posting_date: '2026-02-10',
      transaction_type: 'SAVINGS_DEPOSIT',
      reference_no: 'SFE-OR-2026-0002',
      description: '1-Year Special Time Deposit placement - Lourdes Ramos',
      total_debit: 50000,
      total_credit: 50000,
      status: 'Posted',
      created_by: 'Cashier San Fernando',
      approved_by: 'Carmela Santos',
      created_at: '2026-02-10T12:05:00Z'
    },
    // JV 13: Eduardo Manalo Share Capital
    {
      id: 'jv_sample_13',
      voucher_number: 'TAR-OR-2026-000003',
      branch_id: 'branch_tar',
      branch_name: 'Main Branch - Tarlac',
      posting_date: '2026-02-20',
      transaction_type: 'SHARE_CAPITAL_PAYMENT',
      reference_no: 'TAR-OR-2026-0003',
      description: 'Paid-up share capital contribution - Eduardo Manalo',
      total_debit: 30000,
      total_credit: 30000,
      status: 'Posted',
      created_by: 'Maria Gomez',
      approved_by: 'Arturo Santos',
      created_at: '2026-02-20T14:35:00Z'
    },
    // JV 14: Youth Saver Deposit
    {
      id: 'jv_sample_14',
      voucher_number: 'URD-OR-2026-000003',
      branch_id: 'branch_urd',
      branch_name: 'Urdaneta Branch',
      posting_date: '2026-03-01',
      transaction_type: 'SAVINGS_DEPOSIT',
      reference_no: 'URD-OR-2026-0003',
      description: 'Youth saver deposit - Ana Beatrice Dizon',
      total_debit: 3500,
      total_credit: 3500,
      status: 'Posted',
      created_by: 'Cashier Urdaneta',
      approved_by: 'Roberto Valenzuela',
      created_at: '2026-03-01T15:15:00Z'
    }
  ];

  // 8. Balanced Journal Lines for each voucher
  const journalLines = [
    // JV 1: Opening Balances (Dr Bank 500,000, Cr General Reserve Fund 500,000)
    { id: 'jl_01_1', journal_entry_id: 'jv_sample_01', account_id: 'acc_1120', debit: 500000, credit: 0, description: 'LBP Operating Bank clearing account deposit' },
    { id: 'jl_01_2', journal_entry_id: 'jv_sample_01', account_id: 'acc_3210', debit: 0, credit: 500000, description: 'General Reserve Fund baseline' },

    // JV 2: Share Capital - Juan Dela Cruz (Dr Cash 15,000, Cr Share Capital 15,000)
    { id: 'jl_02_1', journal_entry_id: 'jv_sample_02', account_id: 'acc_1110', debit: 15000, credit: 0, description: 'Cash received for share capital' },
    { id: 'jl_02_2', journal_entry_id: 'jv_sample_02', account_id: 'acc_3110', debit: 0, credit: 15000, description: 'Paid-up share capital - Juan Dela Cruz' },

    // JV 3: Share Capital - Maria Clara (Dr Cash 20,000, Cr Share Capital 20,000)
    { id: 'jl_03_1', journal_entry_id: 'jv_sample_03', account_id: 'acc_1110', debit: 20000, credit: 0, description: 'Cash received for share capital' },
    { id: 'jl_03_2', journal_entry_id: 'jv_sample_03', account_id: 'acc_3110', debit: 0, credit: 20000, description: 'Paid-up share capital - Maria Clara Reyes' },

    // JV 4: Savings Deposit - Juan (Dr Cash 18,500, Cr Savings Deposits 18,500)
    { id: 'jl_04_1', journal_entry_id: 'jv_sample_04', account_id: 'acc_1110', debit: 18500, credit: 0, description: 'Cash received for regular savings' },
    { id: 'jl_04_2', journal_entry_id: 'jv_sample_04', account_id: 'acc_2110', debit: 0, credit: 18500, description: 'Regular savings deposits liability' },

    // JV 5: Savings Deposit - Maria Clara (Dr Cash 34,000, Cr Savings Deposits 34,000)
    { id: 'jl_05_1', journal_entry_id: 'jv_sample_05', account_id: 'acc_1110', debit: 34000, credit: 0, description: 'Cash received for regular savings' },
    { id: 'jl_05_2', journal_entry_id: 'jv_sample_05', account_id: 'acc_2110', debit: 0, credit: 34000, description: 'Regular savings deposits liability' },

    // JV 6: Loan Release - Juan Agri Loan 60,000 (Dr Agri Loans 60,000, Cr Cash 58,800, Cr Fee Income 1,200)
    { id: 'jl_06_1', journal_entry_id: 'jv_sample_06', account_id: 'acc_1230', debit: 60000, credit: 0, description: 'Principal amount of Agricultural Crop Loan' },
    { id: 'jl_06_2', journal_entry_id: 'jv_sample_06', account_id: 'acc_1110', debit: 0, credit: 58800, description: 'Net cash disbursed to borrower' },
    { id: 'jl_06_3', journal_entry_id: 'jv_sample_06', account_id: 'acc_4120', debit: 0, credit: 1200, description: 'Service & processing fees deducted' },

    // JV 7: Loan Release - Maria Clara Multi-Purpose Loan 100,000 (Dr Loans Regular 100,000, Cr Cash 97,750, Cr Fee Income 2,250)
    { id: 'jl_07_1', journal_entry_id: 'jv_sample_07', account_id: 'acc_1210', debit: 100000, credit: 0, description: 'Principal amount of Regular Multi-Purpose Loan' },
    { id: 'jl_07_2', journal_entry_id: 'jv_sample_07', account_id: 'acc_1110', debit: 0, credit: 97750, description: 'Net cash disbursed to borrower' },
    { id: 'jl_07_3', journal_entry_id: 'jv_sample_07', account_id: 'acc_4120', debit: 0, credit: 2250, description: 'Service & processing fees deducted' },

    // JV 8: Loan Repayment - Maria Clara 9,166.66 (Dr Cash 9,166.66, Cr Loans Regular 8,333.33, Cr Interest Income 833.33)
    { id: 'jl_08_1', journal_entry_id: 'jv_sample_08', account_id: 'acc_1110', debit: 9166.66, credit: 0, description: 'Cash collected for loan installment #1' },
    { id: 'jl_08_2', journal_entry_id: 'jv_sample_08', account_id: 'acc_1210', debit: 0, credit: 8333.33, description: 'Principal reduction on regular loan' },
    { id: 'jl_08_3', journal_entry_id: 'jv_sample_08', account_id: 'acc_4110', debit: 0, credit: 833.33, description: 'Interest income collected on regular loan' },

    // JV 9: Share Capital - Rodrigo Mendoza Urdaneta (Dr Cash 6,000, Cr Share Capital 6,000)
    { id: 'jl_09_1', journal_entry_id: 'jv_sample_09', account_id: 'acc_1110', debit: 6000, credit: 0, description: 'Cash received at Urdaneta for share capital' },
    { id: 'jl_09_2', journal_entry_id: 'jv_sample_09', account_id: 'acc_3110', debit: 0, credit: 6000, description: 'Paid-up share capital - Rodrigo Mendoza' },

    // JV 10: Savings Deposit - Rodrigo Mendoza Urdaneta (Dr Cash 12,500, Cr Savings Deposits 12,500)
    { id: 'jl_10_1', journal_entry_id: 'jv_sample_10', account_id: 'acc_1110', debit: 12500, credit: 0, description: 'Cash received at Urdaneta for savings' },
    { id: 'jl_10_2', journal_entry_id: 'jv_sample_10', account_id: 'acc_2110', debit: 0, credit: 12500, description: 'Regular savings deposits liability' },

    // JV 11: Share Capital - Lourdes Ramos San Fernando (Dr Cash 25,000, Cr Share Capital 25,000)
    { id: 'jl_11_1', journal_entry_id: 'jv_sample_11', account_id: 'acc_1110', debit: 25000, credit: 0, description: 'Cash received at San Fernando for share capital' },
    { id: 'jl_11_2', journal_entry_id: 'jv_sample_11', account_id: 'acc_3110', debit: 0, credit: 25000, description: 'Paid-up share capital - Lourdes Ramos' },

    // JV 12: Time Deposit - Lourdes Ramos San Fernando (Dr Cash 50,000, Cr Time Deposits 50,000)
    { id: 'jl_12_1', journal_entry_id: 'jv_sample_12', account_id: 'acc_1110', debit: 50000, credit: 0, description: 'Cash received for Special Time Deposit' },
    { id: 'jl_12_2', journal_entry_id: 'jv_sample_12', account_id: 'acc_2120', debit: 0, credit: 50000, description: 'Special Savings & Time Deposits liability' },

    // JV 13: Share Capital - Eduardo Manalo (Dr Cash 30,000, Cr Share Capital 30,000)
    { id: 'jl_13_1', journal_entry_id: 'jv_sample_13', account_id: 'acc_1110', debit: 30000, credit: 0, description: 'Cash received for share capital' },
    { id: 'jl_13_2', journal_entry_id: 'jv_sample_13', account_id: 'acc_3110', debit: 0, credit: 30000, description: 'Paid-up share capital - Eduardo Manalo' },

    // JV 14: Youth Saver Deposit - Ana Beatrice (Dr Cash 3,500, Cr Savings Deposits 3,500)
    { id: 'jl_14_1', journal_entry_id: 'jv_sample_14', account_id: 'acc_1110', debit: 3500, credit: 0, description: 'Cash received for youth savings' },
    { id: 'jl_14_2', journal_entry_id: 'jv_sample_14', account_id: 'acc_2110', debit: 0, credit: 3500, description: 'Regular savings deposits liability' }
  ];

  // 9. Reconciled Cash Account Balances
  // Cash on Hand:
  // Inflows: 15k + 20k + 18.5k + 34k - 58.8k - 97.75k + 9.166.66 + 30k = 20,116.66 in Tarlac teller
  // Urdaneta teller: 6k + 12.5k + 3.5k = 22,000
  // San Fernando teller: 25k + 50k = 75,000
  // LBP Bank: 500,000
  const cashAccounts = cleanSeed.cash_accounts.map(ca => {
    if (ca.id === 'cash_01') {
      return { ...ca, opening_balance: 50000, current_balance: 70116.66 };
    } else if (ca.id === 'cash_02') {
      return { ...ca, opening_balance: 100000, current_balance: 100000 };
    } else if (ca.id === 'cash_03') {
      return { ...ca, opening_balance: 500000, current_balance: 500000 };
    } else if (ca.id === 'cash_05') {
      return { ...ca, opening_balance: 30000, current_balance: 52000 };
    } else if (ca.id === 'cash_06') {
      return { ...ca, opening_balance: 30000, current_balance: 105000 };
    }
    return ca;
  });

  // 10. Audit trail entry
  const auditEntry = {
    id: `audit_sample_${Date.now()}`,
    setting: 'System Setup: Full Sample Dataset Population',
    old_value: 'Previous Database State',
    new_value: 'Complete Realistic Agricultural Cooperative Dataset (6 Members, 5 Share Capital, 5 Savings, 4 Loans, 14 Balanced Journal Entries)',
    changed_by: 'Setup Wizard',
    created_at: new Date().toISOString(),
    reason: 'User initialized system with complete realistic sample data via Setup Wizard'
  };

  return {
    ...cleanSeed,
    members,
    share_capital_accounts: shareCapitalAccounts,
    share_capital_transactions: shareCapitalTransactions,
    savings_accounts: savingsAccounts,
    savings_transactions: savingsTransactions,
    loan_applications: loanApplications,
    loans,
    loan_amortization_schedules: loanSchedules,
    loan_payments: loanPayments,
    loan_payment_allocations: loanPaymentAllocations,
    cash_accounts: cashAccounts,
    journal_entries: journalEntries,
    journal_lines: journalLines,
    configuration_audit_trails: [auditEntry]
  };
}

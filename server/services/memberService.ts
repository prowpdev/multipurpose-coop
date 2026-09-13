import { db } from '../db/database';
import { NumberingService } from './numberingService';

export interface CreateMemberInput {
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender?: string;
  birthdate?: string;
  phone?: string;
  email?: string;
  address?: string;
  branch_id: string;
  member_type_id: string;
  custom_field_values?: Record<string, any>;
  joined_date?: string;
}

export class MemberService {
  /**
   * Retrieves all members with optional branch filter and search query
   */
  public static getAll(options?: { branch_id?: string; search?: string; active_only?: boolean }) {
    let members = db.getTable('members');
    if (options?.branch_id && options.branch_id !== 'all') {
      members = members.filter(m => m.branch_id === options.branch_id);
    }
    if (options?.active_only) {
      members = members.filter(m => m.active !== false && m.status !== 'Inactive');
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      members = members.filter(
        m =>
          m.member_no?.toLowerCase().includes(q) ||
          m.first_name?.toLowerCase().includes(q) ||
          m.last_name?.toLowerCase().includes(q) ||
          m.email?.toLowerCase().includes(q)
      );
    }
    return members;
  }

  /**
   * Finds a member by primary ID or member number
   */
  public static getById(id: string) {
    const members = db.getTable('members');
    return members.find(m => m.id === id || m.member_no === id) || null;
  }

  /**
   * Creates a new member with automated document numbering and branch metadata
   */
  public static create(input: CreateMemberInput, createdBy = 'System Admin') {
    const branches = db.getTable('branches');
    const memberTypes = db.getTable('member_types');

    const branch = branches.find(b => b.id === input.branch_id) || branches[0];
    const memberType = memberTypes.find(mt => mt.id === input.member_type_id) || memberTypes[0];

    const branchCode = branch?.code || 'MAIN';
    const memberNo = NumberingService.generateNumber('DOC_MEMBER_ID', {
      branch_code: branchCode,
      increment: true
    });

    const newMember = {
      id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      member_no: memberNo,
      first_name: input.first_name.trim(),
      middle_name: input.middle_name?.trim() || '',
      last_name: input.last_name.trim(),
      gender: input.gender || 'Not Specified',
      birthdate: input.birthdate || '1990-01-01',
      phone: input.phone || '',
      email: input.email || '',
      address: input.address || '',
      branch_id: input.branch_id,
      branch_name: branch?.name || 'Main Branch',
      member_type_id: input.member_type_id,
      member_type_name: memberType?.name || 'Regular Member',
      custom_field_values: input.custom_field_values || {},
      joined_date: input.joined_date || new Date().toISOString().split('T')[0],
      active: true,
      status: 'Active',
      created_at: new Date().toISOString()
    };

    db.insert('members', newMember);
    db.recordAudit(
      `Member Registered: ${newMember.first_name} ${newMember.last_name} (${newMember.member_no})`,
      null,
      newMember,
      createdBy,
      'New member registration'
    );

    return newMember;
  }

  /**
   * Updates existing member details
   */
  public static update(id: string, updates: Partial<CreateMemberInput> & { active?: boolean; status?: string }, updatedBy = 'System Admin') {
    const existing = this.getById(id);
    if (!existing) {
      throw new Error(`Member with ID '${id}' not found`);
    }

    const updated = {
      ...existing,
      ...updates,
      id: existing.id,
      member_no: existing.member_no, // Preserve original identifier
      updated_at: new Date().toISOString()
    };

    db.update('members', m => m.id === existing.id, () => updated);
    db.recordAudit(
      `Member Updated: ${updated.member_no}`,
      existing,
      updated,
      updatedBy,
      'Updated member record'
    );

    return updated;
  }

  /**
   * Compiles comprehensive financial summary for a member (shares, savings, active loans)
   */
  public static getFinancialSummary(memberId: string) {
    const member = this.getById(memberId);
    if (!member) throw new Error(`Member '${memberId}' not found`);

    const shareAccounts = db.getTable('share_capital_accounts').filter(a => a.member_id === member.id);
    const savingsAccounts = db.getTable('savings_accounts').filter(a => a.member_id === member.id);
    const loans = db.getTable('loans').filter(l => l.member_id === member.id);

    const totalShareCapital = shareAccounts.reduce((sum, a) => sum + (Number(a.paid_amount) || 0), 0);
    const totalSavings = savingsAccounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
    const totalLoanPrincipal = loans.reduce((sum, l) => sum + (Number(l.principal_amount) || 0), 0);
    const totalLoanBalance = loans.reduce((sum, l) => sum + (Number(l.outstanding_principal) || 0), 0);

    return {
      member,
      shares: {
        accounts: shareAccounts,
        total_paid: totalShareCapital
      },
      savings: {
        accounts: savingsAccounts,
        total_balance: totalSavings
      },
      loans: {
        records: loans,
        total_borrowed: totalLoanPrincipal,
        total_outstanding: totalLoanBalance,
        active_loans_count: loans.filter(l => l.status === 'Active' || l.status === 'Disbursed').length
      }
    };
  }
}

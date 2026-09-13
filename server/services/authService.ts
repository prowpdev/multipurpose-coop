import { db } from '../db/database';

export interface UserSession {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: string;
  role_name: string;
  branch_id?: string;
  branch_name?: string;
  permissions: string[];
}

export class AuthService {
  /**
   * Authenticates user against configured user accounts
   */
  public static login(username: string, password?: string): { success: boolean; user?: UserSession; token?: string; error?: string } {
    const users = db.getTable('users');
    const roles = db.getTable('user_roles');
    const branches = db.getTable('branches');

    const cleanUsername = username.trim().toLowerCase();
    const user = users.find(u => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanUsername);

    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    if (user.active === false) {
      return { success: false, error: 'User account is deactivated. Contact system administrator.' };
    }

    const role = roles.find(r => r.id === user.role_id || r.name === user.role_id) || {
      id: 'role_admin',
      name: 'System Administrator',
      permissions: ['*']
    };

    const branch = branches.find(b => b.id === user.branch_id);

    const session: UserSession = {
      id: user.id,
      username: user.username,
      full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
      email: user.email || '',
      role: role.id,
      role_name: role.name,
      branch_id: user.branch_id,
      branch_name: branch?.name || 'All Branches',
      permissions: role.permissions || ['*']
    };

    const mockToken = `coop_jwt_${Buffer.from(`${user.id}:${Date.now()}`).toString('base64')}`;

    db.recordAudit(
      `User Login: ${user.username}`,
      null,
      { username: user.username, role: role.name, branch: session.branch_name },
      user.username,
      'User authenticated session'
    );

    return {
      success: true,
      user: session,
      token: mockToken
    };
  }

  /**
   * Registers a new cooperative user
   */
  public static register(params: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role_id: string;
    branch_id?: string;
    created_by?: string;
  }) {
    const users = db.getTable('users');
    const existing = users.find(u => u.username.toLowerCase() === params.username.toLowerCase().trim());
    if (existing) {
      throw new Error(`Username '${params.username}' is already taken.`);
    }

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      username: params.username.trim(),
      first_name: params.first_name.trim(),
      last_name: params.last_name.trim(),
      email: params.email.trim(),
      role_id: params.role_id,
      branch_id: params.branch_id || 'branch_tar',
      active: true,
      created_at: new Date().toISOString()
    };

    db.insert('users', newUser);
    return newUser;
  }
}

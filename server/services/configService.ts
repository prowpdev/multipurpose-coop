import { db } from '../db/database';

export class ConfigService {
  /**
   * Retrieves the full configuration bundle for client hydration
   */
  public static getAll() {
    return db.getRawData();
  }

  /**
   * Updates system parameter setting
   */
  public static updateSystemSetting(key: string, value: any, changedBy = 'Admin', reason = 'Configuration update') {
    const settings = db.getTable('system_settings');
    const existing = settings.find(s => s.key === key);
    if (existing) {
      const oldSnapshot = { ...existing };
      existing.value = value;
      existing.updated_at = new Date().toISOString();
      db.update('system_settings', s => s.key === key, () => existing);
      db.recordAudit(`System Setting: ${key}`, oldSnapshot, existing, changedBy, reason);
      return existing;
    }
    const newSetting = {
      id: `set_${key}`,
      key,
      value,
      description: '',
      updated_at: new Date().toISOString()
    };
    db.insert('system_settings', newSetting);
    db.recordAudit(`System Setting: ${key}`, null, newSetting, changedBy, reason);
    return newSetting;
  }

  /**
   * Updates loan product with automatic product versioning (preserving historical loans)
   */
  public static updateLoanProduct(id: string, updates: any, changedBy = 'Admin', reason = 'Product update') {
    const products = db.getTable('loan_products');
    const existing = products.find(p => p.id === id);
    if (!existing) throw new Error(`Loan product '${id}' not found`);

    const oldSnapshot = { ...existing };
    const newVersion = (existing.version || 1) + 1;

    // Archive previous version in loan_product_versions table
    db.insert('loan_product_versions', {
      id: `lpv_${existing.id}_v${existing.version || 1}`,
      product_id: existing.id,
      version: existing.version || 1,
      snapshot: oldSnapshot,
      archived_at: new Date().toISOString(),
      archived_by: changedBy,
      reason
    });

    const updated = {
      ...existing,
      ...updates,
      id: existing.id,
      version: newVersion,
      updated_at: new Date().toISOString()
    };

    db.update('loan_products', p => p.id === id, () => updated);
    db.recordAudit(`Loan Product: ${existing.name} (v${newVersion})`, oldSnapshot, updated, changedBy, reason);

    return { product: updated, previous_version: oldSnapshot };
  }
}

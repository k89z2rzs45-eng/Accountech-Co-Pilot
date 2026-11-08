// Local-First Storage Engine for AccounTech Co-Pilot
// Completely independent of any third-party cloud service. Data is stored locally and securely.

const STORAGE_PREFIX = 'accountech_v3_';

// Initial Seed Data to make the software feel alive out-of-the-box
const INITIAL_SEED = {
  Company: [
    {
      id: 'comp_1',
      name: 'AccounTech Global Inc.',
      email: 'owner@accountech.local',
      created_by: 'owner@accountech.local',
      currency: 'USD',
      country: 'US',
      fiscal_year_start: 'January',
      tax_id: 'US-892348123',
      created_date: new Date(Date.now() - 60 * 86400000).toISOString()
    }
  ],
  Transaction: [
    {
      id: 'tx_1',
      description: 'Enterprise Cloud Retainer - Acme Corp',
      amount: 14500,
      type: 'income',
      category: 'Consulting',
      date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      status: 'completed',
      payment_method: 'Bank Transfer',
      client_name: 'Acme Corp',
      created_date: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: 'tx_2',
      description: 'Monthly SaaS Infrastructure & Hosting',
      amount: 1250,
      type: 'expense',
      category: 'Software & Cloud',
      date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
      status: 'completed',
      payment_method: 'Credit Card',
      created_date: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'tx_3',
      description: 'Q3 Advisory Payment - TechStart Labs',
      amount: 8200,
      type: 'income',
      category: 'Advisory',
      date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
      status: 'completed',
      payment_method: 'Stripe',
      client_name: 'TechStart Labs',
      created_date: new Date(Date.now() - 7 * 86400000).toISOString()
    },
    {
      id: 'tx_4',
      description: 'Downtown Office Lease & Utilities',
      amount: 3200,
      type: 'expense',
      category: 'Rent & Utilities',
      date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
      status: 'completed',
      payment_method: 'Bank Transfer',
      created_date: new Date(Date.now() - 10 * 86400000).toISOString()
    },
    {
      id: 'tx_5',
      description: 'Custom AI Solution Deployment - NexaWave',
      amount: 18900,
      type: 'income',
      category: 'Product Sales',
      date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
      status: 'completed',
      payment_method: 'Wire Transfer',
      client_name: 'NexaWave AI',
      created_date: new Date(Date.now() - 14 * 86400000).toISOString()
    },
    {
      id: 'tx_6',
      description: 'Digital Marketing & Lead Generation Campaign',
      amount: 2400,
      type: 'expense',
      category: 'Marketing',
      date: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0],
      status: 'completed',
      payment_method: 'Credit Card',
      created_date: new Date(Date.now() - 18 * 86400000).toISOString()
    }
  ],
  Invoice: [
    {
      id: 'inv_1',
      invoice_number: 'INV-2026-001',
      client_name: 'Acme Corp',
      client_email: 'billing@acmecorp.com',
      total_amount: 14500,
      status: 'paid',
      due_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      created_date: new Date(Date.now() - 10 * 86400000).toISOString(),
      items: [
        { description: 'Quarterly Advisory Package', quantity: 1, unit_price: 14500, amount: 14500 }
      ]
    },
    {
      id: 'inv_2',
      invoice_number: 'INV-2026-002',
      client_name: 'Horizon Retailers',
      client_email: 'accounts@horizon.co',
      total_amount: 6750,
      status: 'pending',
      due_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      created_date: new Date(Date.now() - 3 * 86400000).toISOString(),
      items: [
        { description: 'Inventory Integration Module', quantity: 1, unit_price: 6750, amount: 6750 }
      ]
    },
    {
      id: 'inv_3',
      invoice_number: 'INV-2026-003',
      client_name: 'Summit Financial',
      client_email: 'finance@summit.org',
      total_amount: 9800,
      status: 'pending',
      due_date: new Date(Date.now() + 18 * 86400000).toISOString().split('T')[0],
      created_date: new Date(Date.now() - 1 * 86400000).toISOString(),
      items: [
        { description: 'Enterprise Data Audit Service', quantity: 1, unit_price: 9800, amount: 9800 }
      ]
    }
  ],
  Expense: [
    {
      id: 'exp_1',
      title: 'AWS & Cloud Hosting',
      amount: 1250,
      category: 'Software & Cloud',
      date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
      payment_method: 'Credit Card',
      vendor: 'Amazon Web Services',
      is_deductible: true,
      created_date: new Date(Date.now() - 4 * 86400000).toISOString()
    },
    {
      id: 'exp_2',
      title: 'Downtown Office Rent',
      amount: 3200,
      category: 'Rent & Utilities',
      date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
      payment_method: 'Bank Transfer',
      vendor: 'Metropolitan Commercial Realty',
      is_deductible: true,
      created_date: new Date(Date.now() - 10 * 86400000).toISOString()
    },
    {
      id: 'exp_3',
      title: 'Marketing & Ad Spend',
      amount: 2400,
      category: 'Marketing',
      date: new Date(Date.now() - 18 * 86400000).toISOString().split('T')[0],
      payment_method: 'Credit Card',
      vendor: 'Google Ads',
      is_deductible: true,
      created_date: new Date(Date.now() - 18 * 86400000).toISOString()
    }
  ],
  Budget: [
    {
      id: 'bdg_1',
      name: 'Software & IT Infrastructure',
      category: 'Software & Cloud',
      amount: 2500,
      spent: 1250,
      period: 'monthly',
      currency: 'USD',
      created_date: new Date().toISOString()
    },
    {
      id: 'bdg_2',
      name: 'Marketing & Customer Acquisition',
      category: 'Marketing',
      amount: 4000,
      spent: 2400,
      period: 'monthly',
      currency: 'USD',
      created_date: new Date().toISOString()
    },
    {
      id: 'bdg_3',
      name: 'Office & Facilities',
      category: 'Rent & Utilities',
      amount: 3500,
      spent: 3200,
      period: 'monthly',
      currency: 'USD',
      created_date: new Date().toISOString()
    }
  ],
  Client: [
    {
      id: 'cli_1',
      name: 'Acme Corp',
      email: 'contact@acmecorp.com',
      phone: '+1 (555) 019-2834',
      status: 'active',
      total_billed: 14500,
      created_date: new Date(Date.now() - 60 * 86400000).toISOString()
    },
    {
      id: 'cli_2',
      name: 'Horizon Retailers',
      email: 'billing@horizon.co',
      phone: '+1 (555) 048-8921',
      status: 'active',
      total_billed: 6750,
      created_date: new Date(Date.now() - 40 * 86400000).toISOString()
    },
    {
      id: 'cli_3',
      name: 'Summit Financial',
      email: 'support@summit.org',
      phone: '+1 (555) 091-3829',
      status: 'active',
      total_billed: 9800,
      created_date: new Date(Date.now() - 20 * 86400000).toISOString()
    }
  ],
  Product: [
    {
      id: 'prod_1',
      name: 'AI Advisory Annual Seat',
      sku: 'SKU-AI-001',
      price: 4500,
      cost: 400,
      stock: 99,
      created_date: new Date().toISOString()
    },
    {
      id: 'prod_2',
      name: 'Cloud Data Pipeline Setup',
      sku: 'SKU-DATA-002',
      price: 2800,
      cost: 300,
      stock: 50,
      created_date: new Date().toISOString()
    }
  ],
  FinancialAlert: [
    {
      id: 'fa_1',
      title: 'Healthy Net Profit Margin',
      message: 'Net profit margin is up 18.4% compared to last cycle.',
      type: 'success',
      severity: 'high',
      alert_type: 'revenue_growth',
      detected_value: 14500,
      baseline_value: 12000,
      ai_confidence: 94,
      status: 'active',
      created_date: new Date().toISOString()
    },
    {
      id: 'fa_2',
      title: 'Upcoming Invoice Payment',
      message: 'Invoice INV-2026-002 for Horizon Retailers is due in 5 days.',
      type: 'warning',
      severity: 'medium',
      alert_type: 'invoice_due',
      detected_value: 6750,
      baseline_value: 6000,
      ai_confidence: 98,
      status: 'active',
      created_date: new Date().toISOString()
    }
  ]
};

function getStorage(key) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) {
      if (INITIAL_SEED[key]) {
        setStorage(key, INITIAL_SEED[key]);
        return [...INITIAL_SEED[key]];
      }
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to read ${key} from storage:`, e);
    return INITIAL_SEED[key] ? [...INITIAL_SEED[key]] : [];
  }
}

function setStorage(key, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to write ${key} to storage:`, e);
  }
}

export function createLocalEntityManager(entityName) {
  return {
    async list(sort = '-created_date', limit = 100, skip = 0) {
      let items = getStorage(entityName);

      // Sort handling
      if (sort && typeof sort === 'string') {
        const isDesc = sort.startsWith('-');
        const field = isDesc ? sort.substring(1) : sort;
        items.sort((a, b) => {
          const valA = a[field] ?? '';
          const valB = b[field] ?? '';
          if (valA < valB) return isDesc ? 1 : -1;
          if (valA > valB) return isDesc ? -1 : 1;
          return 0;
        });
      }

      // Pagination
      if (skip > 0) items = items.slice(skip);
      if (limit > 0) items = items.slice(0, limit);

      return [...items];
    },

    async filter(query = {}, sort = '-created_date', limit = 100, skip = 0) {
      let items = getStorage(entityName);

      // Simple match filtering
      if (query && typeof query === 'object') {
        items = items.filter(item => {
          for (const key of Object.keys(query)) {
            if (query[key] !== undefined && query[key] !== null) {
              if (String(item[key]).toLowerCase() !== String(query[key]).toLowerCase()) {
                return false;
              }
            }
          }
          return true;
        });
      }

      // Sort
      if (sort && typeof sort === 'string') {
        const isDesc = sort.startsWith('-');
        const field = isDesc ? sort.substring(1) : sort;
        items.sort((a, b) => {
          const valA = a[field] ?? '';
          const valB = b[field] ?? '';
          if (valA < valB) return isDesc ? 1 : -1;
          if (valA > valB) return isDesc ? -1 : 1;
          return 0;
        });
      }

      if (skip > 0) items = items.slice(skip);
      if (limit > 0) items = items.slice(0, limit);

      return [...items];
    },

    async get(id) {
      const items = getStorage(entityName);
      return items.find(item => item.id === id) || null;
    },

    async create(data) {
      const items = getStorage(entityName);
      const newRecord = {
        ...data,
        id: data.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        created_date: data.created_date || new Date().toISOString()
      };
      items.unshift(newRecord);
      setStorage(entityName, items);
      return { ...newRecord };
    },

    async update(id, data) {
      const items = getStorage(entityName);
      const index = items.findIndex(item => item.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...data, updated_date: new Date().toISOString() };
        setStorage(entityName, items);
        return { ...items[index] };
      }
      return null;
    },

    async delete(id) {
      let items = getStorage(entityName);
      items = items.filter(item => item.id !== id);
      setStorage(entityName, items);
      return { success: true, id };
    },

    async deleteMany(ids = []) {
      let items = getStorage(entityName);
      const idSet = new Set(ids);
      items = items.filter(item => !idSet.has(item.id));
      setStorage(entityName, items);
      return { success: true, count: ids.length };
    },

    async bulkCreate(records = []) {
      const items = getStorage(entityName);
      const created = records.map(r => ({
        ...r,
        id: r.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        created_date: r.created_date || new Date().toISOString()
      }));
      items.unshift(...created);
      setStorage(entityName, items);
      return created;
    }
  };
}

// Local User & Session Manager
const DEFAULT_USER = {
  id: 'usr_local_owner',
  full_name: 'Alex Rivera',
  email: 'owner@accountech.local',
  role: 'admin',
  company_name: 'AccounTech Global Inc.',
  country: 'US',
  preferred_currency: 'USD',
  onboarding_completed: true,
  permissions: ['all', 'admin', 'finance', 'invoices', 'reports']
};

export const localUser = {
  async me() {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + 'currentUser');
      return raw ? JSON.parse(raw) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  },

  async updateMyUserData(updates) {
    try {
      const current = await this.me();
      const updated = { ...current, ...updates };
      localStorage.setItem(STORAGE_PREFIX + 'currentUser', JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to update user profile:', e);
      return DEFAULT_USER;
    }
  },

  async updateMe(updates) {
    return this.updateMyUserData(updates);
  },

  async isAuthenticated() {
    return true; // Always authenticated locally
  },

  login() {
    // No external login redirection needed!
    return Promise.resolve(true);
  },

  async logout() {
    // Local logout just resets or stays in session
    return Promise.resolve(true);
  }
};

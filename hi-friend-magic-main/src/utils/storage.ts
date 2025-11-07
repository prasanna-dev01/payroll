// Storage utilities for data persistence

export const storage = {
  async get<T>(key: string, defaultValue: T): Promise<T> {
    try {
      // Use localStorage for data persistence
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  },

  async set(key: string, value: any): Promise<void> {
    try {
      // Use localStorage for data persistence
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }
};

// Storage keys
export const STORAGE_KEYS = {
  CURRENT_USER: 'current-user',
  COMPANY_SETTINGS: 'company-settings',
  EMPLOYEES: 'employees',
  USERS: 'users',
  SALARY_STRUCTURES: 'salary-structures',
  PAYROLL_RUNS: 'payroll-runs',
  LEAVE_REQUESTS: 'leave-requests',
  AUDIT_LOGS: 'audit-logs',
  ATTENDANCE: (month: string) => `attendance-${month}`,
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, SalaryStructure, PayrollRun, LeaveRequest, CompanySettings, AttendanceRecord } from '@/types';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { generateSampleEmployees, sampleSalaryStructures, sampleCompanySettings, generateSampleAttendance } from '@/utils/sampleData';
import { subMonths, format } from 'date-fns';

interface DataContextType {
  employees: Employee[];
  salaryStructures: SalaryStructure[];
  payrollRuns: PayrollRun[];
  leaveRequests: LeaveRequest[];
  companySettings: CompanySettings;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  addEmployee: (employee: Employee) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  getAttendance: (month: string) => Promise<AttendanceRecord[]>;
  saveAttendance: (month: string, records: AttendanceRecord[]) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>([]);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(sampleCompanySettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      // Initialize employees
      let storedEmployees = await storage.get<Employee[]>(STORAGE_KEYS.EMPLOYEES, []);
      if (storedEmployees.length === 0) {
        storedEmployees = generateSampleEmployees();
        await storage.set(STORAGE_KEYS.EMPLOYEES, storedEmployees);
        
        // Generate attendance for last 3 months
        const now = new Date();
        for (let i = 0; i < 3; i++) {
          const month = subMonths(now, i);
          const monthKey = format(month, 'yyyy-MM');
          const attendance = generateSampleAttendance(
            storedEmployees.map(e => e.id),
            month
          );
          await storage.set(STORAGE_KEYS.ATTENDANCE(monthKey), attendance);
        }
      }
      setEmployees(storedEmployees);

      // Initialize salary structures
      let storedStructures = await storage.get<SalaryStructure[]>(STORAGE_KEYS.SALARY_STRUCTURES, []);
      if (storedStructures.length === 0) {
        storedStructures = sampleSalaryStructures;
        await storage.set(STORAGE_KEYS.SALARY_STRUCTURES, storedStructures);
      }
      setSalaryStructures(storedStructures);

      // Initialize company settings
      const storedSettings = await storage.get<CompanySettings>(
        STORAGE_KEYS.COMPANY_SETTINGS,
        sampleCompanySettings
      );
      setCompanySettings(storedSettings);
      if (!await storage.get<CompanySettings>(STORAGE_KEYS.COMPANY_SETTINGS, null)) {
        await storage.set(STORAGE_KEYS.COMPANY_SETTINGS, storedSettings);
      }

      // Load payroll runs
      const storedPayrolls = await storage.get<PayrollRun[]>(STORAGE_KEYS.PAYROLL_RUNS, []);
      setPayrollRuns(storedPayrolls);

      // Load leave requests
      const storedLeaves = await storage.get<LeaveRequest[]>(STORAGE_KEYS.LEAVE_REQUESTS, []);
      setLeaveRequests(storedLeaves);

    } catch (error) {
      console.error('Data initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await initializeData();
  };

  const addEmployee = async (employee: Employee) => {
    const updated = [...employees, employee];
    setEmployees(updated);
    await storage.set(STORAGE_KEYS.EMPLOYEES, updated);
  };

  const updateEmployee = async (employee: Employee) => {
    const updated = employees.map((e) => (e.id === employee.id ? employee : e));
    setEmployees(updated);
    await storage.set(STORAGE_KEYS.EMPLOYEES, updated);
  };

  const deleteEmployee = async (id: string) => {
    const updated = employees.filter((e) => e.id !== id);
    setEmployees(updated);
    await storage.set(STORAGE_KEYS.EMPLOYEES, updated);
  };

  const getAttendance = async (month: string): Promise<AttendanceRecord[]> => {
    return await storage.get<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE(month), []);
  };

  const saveAttendance = async (month: string, records: AttendanceRecord[]) => {
    await storage.set(STORAGE_KEYS.ATTENDANCE(month), records);
  };

  return (
    <DataContext.Provider
      value={{
        employees,
        salaryStructures,
        payrollRuns,
        leaveRequests,
        companySettings,
        isLoading,
        refreshData,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getAttendance,
        saveAttendance,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Sample data for demo purposes

import { User, Employee, SalaryStructure, CompanySettings, PayrollRun, LeaveRequest, AttendanceRecord } from '@/types';
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export const sampleUsers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'super_admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'hr@company.com',
    firstName: 'HR',
    lastName: 'Manager',
    role: 'hr_manager',
    employeeId: 'EMP001',
    department: 'Human Resources',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'payroll@company.com',
    firstName: 'Payroll',
    lastName: 'Manager',
    role: 'payroll_manager',
    employeeId: 'EMP002',
    department: 'Finance',
    createdAt: new Date().toISOString(),
  },
];

const departments = ['Engineering', 'Marketing', 'Sales', 'Finance', 'Human Resources', 'Operations', 'Customer Support'];
const designations = ['Software Engineer', 'Senior Engineer', 'Team Lead', 'Manager', 'Executive', 'Senior Executive', 'Associate'];
const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vikas', 'Anjali', 'Rohit', 'Kavya', 'Sanjay', 'Neha', 'Arjun', 'Pooja', 'Karthik', 'Divya', 'Manoj'];
const lastNames = ['Sharma', 'Kumar', 'Singh', 'Patel', 'Gupta', 'Verma', 'Reddy', 'Nair', 'Iyer', 'Chopra', 'Mehta', 'Shah', 'Joshi', 'Rao', 'Desai'];

export const generateSampleEmployees = (): Employee[] => {
  const employees: Employee[] = [];
  
  for (let i = 1; i <= 50; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const designation = designations[Math.floor(Math.random() * designations.length)];
    
    employees.push({
      id: `emp-${i}`,
      employeeCode: `EMP${String(i).padStart(3, '0')}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      dateOfBirth: new Date(1985 + Math.floor(Math.random() * 15), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      gender: Math.random() > 0.5 ? 'male' : 'female',
      maritalStatus: Math.random() > 0.6 ? 'married' : 'single',
      bloodGroup: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'][Math.floor(Math.random() * 8)],
      dateOfJoining: new Date(2018 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      department,
      designation,
      employeeType: 'full_time',
      bankDetails: {
        bankName: ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank'][Math.floor(Math.random() * 5)],
        accountNumber: String(Math.floor(Math.random() * 900000000000) + 100000000000),
        ifscCode: 'HDFC0001234',
        branch: 'Mumbai Main Branch',
      },
      taxDetails: {
        panNumber: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
        aadhaarNumber: String(Math.floor(Math.random() * 900000000000) + 100000000000),
        taxRegime: Math.random() > 0.5 ? 'new' : 'old',
      },
      salaryStructureId: `sal-struct-${Math.floor(Math.random() * 3) + 1}`,
      emergencyContact: {
        name: `Emergency Contact ${i}`,
        relationship: ['Spouse', 'Parent', 'Sibling'][Math.floor(Math.random() * 3)],
        phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      },
      address: {
        line1: `House ${i}, Street ${Math.floor(Math.random() * 100)}`,
        line2: `Sector ${Math.floor(Math.random() * 50)}`,
        city: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'][Math.floor(Math.random() * 5)],
        state: ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana'][Math.floor(Math.random() * 4)],
        pincode: String(Math.floor(Math.random() * 900000) + 100000),
      },
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  return employees;
};

export const sampleSalaryStructures: SalaryStructure[] = [
  {
    id: 'sal-struct-1',
    name: 'Junior Level',
    ctc: 600000,
    grossSalary: 50000,
    netSalary: 43500,
    components: [
      { id: '1', name: 'Basic Pay', code: 'BASIC', type: 'earning', calculationType: 'fixed', value: 25000, taxable: true, isStatutory: false },
      { id: '2', name: 'HRA', code: 'HRA', type: 'earning', calculationType: 'percentage', value: 50, baseComponent: 'BASIC', taxable: true, isStatutory: false },
      { id: '3', name: 'Special Allowance', code: 'SPECIAL', type: 'earning', calculationType: 'fixed', value: 12500, taxable: true, isStatutory: false },
      { id: '4', name: 'Provident Fund', code: 'PF', type: 'deduction', calculationType: 'percentage', value: 12, baseComponent: 'BASIC', taxable: false, isStatutory: true },
      { id: '5', name: 'Professional Tax', code: 'PT', type: 'deduction', calculationType: 'fixed', value: 200, taxable: false, isStatutory: true },
      { id: '6', name: 'Income Tax (TDS)', code: 'TDS', type: 'deduction', calculationType: 'fixed', value: 1500, taxable: false, isStatutory: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sal-struct-2',
    name: 'Mid Level',
    ctc: 1200000,
    grossSalary: 100000,
    netSalary: 87000,
    components: [
      { id: '1', name: 'Basic Pay', code: 'BASIC', type: 'earning', calculationType: 'fixed', value: 50000, taxable: true, isStatutory: false },
      { id: '2', name: 'HRA', code: 'HRA', type: 'earning', calculationType: 'percentage', value: 50, baseComponent: 'BASIC', taxable: true, isStatutory: false },
      { id: '3', name: 'Special Allowance', code: 'SPECIAL', type: 'earning', calculationType: 'fixed', value: 25000, taxable: true, isStatutory: false },
      { id: '4', name: 'Provident Fund', code: 'PF', type: 'deduction', calculationType: 'percentage', value: 12, baseComponent: 'BASIC', taxable: false, isStatutory: true },
      { id: '5', name: 'Professional Tax', code: 'PT', type: 'deduction', calculationType: 'fixed', value: 200, taxable: false, isStatutory: true },
      { id: '6', name: 'Income Tax (TDS)', code: 'TDS', type: 'deduction', calculationType: 'fixed', value: 8000, taxable: false, isStatutory: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sal-struct-3',
    name: 'Senior Level',
    ctc: 2400000,
    grossSalary: 200000,
    netSalary: 170000,
    components: [
      { id: '1', name: 'Basic Pay', code: 'BASIC', type: 'earning', calculationType: 'fixed', value: 100000, taxable: true, isStatutory: false },
      { id: '2', name: 'HRA', code: 'HRA', type: 'earning', calculationType: 'percentage', value: 50, baseComponent: 'BASIC', taxable: true, isStatutory: false },
      { id: '3', name: 'Special Allowance', code: 'SPECIAL', type: 'earning', calculationType: 'fixed', value: 50000, taxable: true, isStatutory: false },
      { id: '4', name: 'Provident Fund', code: 'PF', type: 'deduction', calculationType: 'percentage', value: 12, baseComponent: 'BASIC', taxable: false, isStatutory: true },
      { id: '5', name: 'Professional Tax', code: 'PT', type: 'deduction', calculationType: 'fixed', value: 200, taxable: false, isStatutory: true },
      { id: '6', name: 'Income Tax (TDS)', code: 'TDS', type: 'deduction', calculationType: 'fixed', value: 25000, taxable: false, isStatutory: true },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const sampleCompanySettings: CompanySettings = {
  companyName: 'TechCorp Solutions Pvt Ltd',
  address: {
    line1: 'Tower A, 5th Floor',
    line2: 'Business Park, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400059',
  },
  pan: 'AABCT1234F',
  gstin: '27AABCT1234F1Z5',
  pfNumber: 'MUMWJ12345',
  esiNumber: '31001234560000101',
  payrollSettings: {
    payCycle: 'monthly',
    payDay: 1,
    attendanceCutoff: 25,
    workingDaysPerMonth: 22,
  },
  taxSettings: {
    pfRate: 12,
    esiRate: 0.75,
    professionalTaxSlabs: [
      { from: 0, to: 7500, amount: 0 },
      { from: 7501, to: 10000, amount: 175 },
      { from: 10001, to: 999999, amount: 200 },
    ],
  },
};

export const generateSampleAttendance = (employeeIds: string[], month: Date): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  });

  employeeIds.forEach((empId) => {
    days.forEach((day) => {
      const dayOfWeek = day.getDay();
      let status: AttendanceRecord['status'] = 'present';

      // Weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        status = 'week_off';
      } else {
        // Random absences (5% chance)
        const rand = Math.random();
        if (rand < 0.02) status = 'absent';
        else if (rand < 0.05) status = 'half_day';
        else if (rand < 0.08) status = 'leave';
      }

      records.push({
        id: `${empId}-${format(day, 'yyyy-MM-dd')}`,
        employeeId: empId,
        date: format(day, 'yyyy-MM-dd'),
        status,
        inTime: status === 'present' || status === 'half_day' ? '09:00' : undefined,
        outTime: status === 'present' ? '18:00' : status === 'half_day' ? '13:00' : undefined,
        workHours: status === 'present' ? 9 : status === 'half_day' ? 4 : 0,
      });
    });
  });

  return records;
};

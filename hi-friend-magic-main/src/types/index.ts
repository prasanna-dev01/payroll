// Core Types for Payroll Application

export type UserRole = 'super_admin' | 'company_admin' | 'hr_manager' | 'payroll_manager' | 'finance_manager' | 'department_manager' | 'employee';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  employeeId?: string;
  department?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  bloodGroup?: string;
  dateOfJoining: string;
  department: string;
  designation: string;
  employeeType: 'full_time' | 'part_time' | 'contract' | 'intern';
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
  taxDetails: {
    panNumber: string;
    aadhaarNumber: string;
    taxRegime: 'old' | 'new';
  };
  salaryStructureId: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  status: 'active' | 'inactive' | 'terminated';
  profilePhoto?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryComponent {
  id: string;
  name: string;
  code: string;
  type: 'earning' | 'deduction' | 'employer_contribution';
  calculationType: 'fixed' | 'percentage' | 'formula';
  value: number;
  baseComponent?: string;
  taxable: boolean;
  isStatutory: boolean;
  description?: string;
}

export interface SalaryStructure {
  id: string;
  name: string;
  components: SalaryComponent[];
  ctc: number;
  grossSalary: number;
  netSalary: number;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: 'present' | 'absent' | 'half_day' | 'leave' | 'holiday' | 'week_off';
  inTime?: string;
  outTime?: string;
  workHours?: number;
  overtimeHours?: number;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: 'paid' | 'sick' | 'casual' | 'comp_off' | 'lop';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface PayrollRun {
  id: string;
  month: number;
  year: number;
  status: 'draft' | 'calculated' | 'approved' | 'paid';
  employeePayrolls: EmployeePayroll[];
  totalAmount: number;
  processedBy: string;
  processedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  createdAt: string;
}

export interface EmployeePayroll {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  designation: string;
  bankDetails: Employee['bankDetails'];
  workingDays: number;
  presentDays: number;
  absentDays: number;
  paidDays: number;
  lopDays: number;
  earnings: PayrollComponent[];
  deductions: PayrollComponent[];
  grossEarnings: number;
  totalDeductions: number;
  netPay: number;
  ytdGross: number;
  ytdDeductions: number;
  ytdNet: number;
}

export interface PayrollComponent {
  name: string;
  code: string;
  amount: number;
  type: 'earning' | 'deduction';
}

export interface CompanySettings {
  companyName: string;
  companyLogo?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  pan: string;
  gstin?: string;
  pfNumber?: string;
  esiNumber?: string;
  payrollSettings: {
    payCycle: 'monthly' | 'bi_weekly' | 'weekly';
    payDay: number;
    attendanceCutoff: number;
    workingDaysPerMonth: number;
  };
  taxSettings: {
    pfRate: number;
    esiRate: number;
    professionalTaxSlabs: { from: number; to: number; amount: number }[];
  };
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}

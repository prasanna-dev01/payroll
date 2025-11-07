// Payroll calculation utilities

import { Employee, SalaryStructure, SalaryComponent, AttendanceRecord, EmployeePayroll, PayrollComponent } from '@/types';

export const calculatePayroll = (
  employee: Employee,
  salaryStructure: SalaryStructure,
  attendanceRecords: AttendanceRecord[],
  workingDays: number
): EmployeePayroll => {
  // Calculate attendance
  const presentDays = attendanceRecords.filter(r => 
    r.status === 'present' || r.status === 'half_day' || r.status === 'leave'
  ).length;
  
  const halfDays = attendanceRecords.filter(r => r.status === 'half_day').length;
  const paidDays = presentDays - (halfDays * 0.5);
  const lopDays = workingDays - paidDays;
  const absentDays = attendanceRecords.filter(r => r.status === 'absent').length;

  // Calculate LOP multiplier
  const lopMultiplier = paidDays / workingDays;

  const earnings: PayrollComponent[] = [];
  const deductions: PayrollComponent[] = [];

  let grossEarnings = 0;
  let basicPay = 0;

  // Process earnings
  salaryStructure.components.forEach((component) => {
    if (component.type === 'earning') {
      let amount = 0;
      
      if (component.calculationType === 'fixed') {
        amount = component.value * lopMultiplier;
      } else if (component.calculationType === 'percentage' && component.baseComponent) {
        const baseComp = salaryStructure.components.find(c => c.code === component.baseComponent);
        if (baseComp) {
          const baseAmount = baseComp.value * lopMultiplier;
          amount = (baseAmount * component.value) / 100;
        }
      }

      earnings.push({
        name: component.name,
        code: component.code,
        amount: Math.round(amount),
        type: 'earning'
      });

      grossEarnings += amount;

      if (component.code === 'BASIC') {
        basicPay = amount;
      }
    }
  });

  // Process deductions
  let totalDeductions = 0;

  salaryStructure.components.forEach((component) => {
    if (component.type === 'deduction') {
      let amount = 0;

      if (component.code === 'PF') {
        amount = (basicPay * 12) / 100;
      } else if (component.code === 'ESI') {
        if (grossEarnings <= 21000) {
          amount = (grossEarnings * 0.75) / 100;
        }
      } else if (component.code === 'PT') {
        amount = calculateProfessionalTax(grossEarnings);
      } else if (component.code === 'TDS') {
        // Simplified TDS calculation
        const annualIncome = grossEarnings * 12;
        amount = calculateTDS(annualIncome, employee.taxDetails.taxRegime) / 12;
      } else if (component.calculationType === 'fixed') {
        amount = component.value;
      } else if (component.calculationType === 'percentage') {
        amount = (grossEarnings * component.value) / 100;
      }

      if (amount > 0) {
        deductions.push({
          name: component.name,
          code: component.code,
          amount: Math.round(amount),
          type: 'deduction'
        });

        totalDeductions += amount;
      }
    }
  });

  const netPay = Math.round(grossEarnings - totalDeductions);

  return {
    employeeId: employee.id,
    employeeCode: employee.employeeCode,
    employeeName: `${employee.firstName} ${employee.lastName}`,
    department: employee.department,
    designation: employee.designation,
    bankDetails: employee.bankDetails,
    workingDays,
    presentDays,
    absentDays,
    paidDays: Math.round(paidDays * 10) / 10,
    lopDays: Math.round(lopDays * 10) / 10,
    earnings,
    deductions,
    grossEarnings: Math.round(grossEarnings),
    totalDeductions: Math.round(totalDeductions),
    netPay,
    ytdGross: 0, // To be calculated from previous months
    ytdDeductions: 0,
    ytdNet: 0,
  };
};

const calculateProfessionalTax = (grossSalary: number): number => {
  // Maharashtra PT slabs as example
  if (grossSalary <= 7500) return 0;
  if (grossSalary <= 10000) return 175;
  if (grossSalary <= 25000) return 200;
  return 200; // Maximum PT per month
};

const calculateTDS = (annualIncome: number, regime: 'old' | 'new'): number => {
  // Simplified TDS calculation (New regime)
  if (regime === 'new') {
    const taxableIncome = annualIncome - 50000; // Standard deduction
    if (taxableIncome <= 300000) return 0;
    if (taxableIncome <= 600000) return (taxableIncome - 300000) * 0.05;
    if (taxableIncome <= 900000) return 15000 + (taxableIncome - 600000) * 0.1;
    if (taxableIncome <= 1200000) return 45000 + (taxableIncome - 900000) * 0.15;
    if (taxableIncome <= 1500000) return 90000 + (taxableIncome - 1200000) * 0.2;
    return 150000 + (taxableIncome - 1500000) * 0.3;
  }
  
  // Old regime (simplified)
  const taxableIncome = annualIncome - 50000;
  if (taxableIncome <= 250000) return 0;
  if (taxableIncome <= 500000) return (taxableIncome - 250000) * 0.05;
  if (taxableIncome <= 1000000) return 12500 + (taxableIncome - 500000) * 0.2;
  return 112500 + (taxableIncome - 1000000) * 0.3;
};

export const generatePayslipPDF = (payroll: EmployeePayroll, companyName: string, month: string, year: number) => {
  // This will be implemented with jsPDF
  console.log('Generate payslip PDF', { payroll, companyName, month, year });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

export const numberToWords = (num: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  if (num === 0) return 'Zero';

  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
  };

  const crores = Math.floor(num / 10000000);
  const lakhs = Math.floor((num % 10000000) / 100000);
  const thousands = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;

  let words = '';
  if (crores > 0) words += convertLessThanThousand(crores) + ' Crore ';
  if (lakhs > 0) words += convertLessThanThousand(lakhs) + ' Lakh ';
  if (thousands > 0) words += convertLessThanThousand(thousands) + ' Thousand ';
  if (remainder > 0) words += convertLessThanThousand(remainder);

  return words.trim() + ' Rupees Only';
};

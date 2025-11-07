import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/payroll';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { employees, payrollRuns, companySettings } = useData();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    currentMonthPayroll: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    const active = employees.filter((e) => e.status === 'active').length;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentPayroll = payrollRuns.find(
      (run) => run.month === currentMonth && run.year === currentYear
    );

    setStats({
      totalEmployees: employees.length,
      activeEmployees: active,
      currentMonthPayroll: currentPayroll?.totalAmount || 0,
      pendingApprovals: payrollRuns.filter((r) => r.status === 'calculated').length,
    });
  }, [employees, payrollRuns]);

  // Department distribution data
  const departmentData = employees.reduce((acc: any[], emp) => {
    const dept = acc.find((d) => d.name === emp.department);
    if (dept) {
      dept.value += 1;
    } else {
      acc.push({ name: emp.department, value: 1 });
    }
    return acc;
  }, []);

  // Monthly payroll trend (mock data)
  const monthlyTrend = [
    { month: 'Jul', amount: 4200000 },
    { month: 'Aug', amount: 4350000 },
    { month: 'Sep', amount: 4280000 },
    { month: 'Oct', amount: 4500000 },
    { month: 'Nov', amount: 4650000 },
    { month: 'Dec', amount: stats.currentMonthPayroll || 4700000 },
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--info))', 'hsl(var(--warning))'];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to {companySettings.companyName}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">{stats.activeEmployees} active</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Month Payroll</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.currentMonthPayroll)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-success">+4.5%</span> from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">Payroll runs awaiting approval</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  stats.currentMonthPayroll / (stats.activeEmployees || 1)
                )}
              </div>
              <p className="text-xs text-muted-foreground">Per employee</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Monthly Payroll Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name} (${entry.value})`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="/payroll/new"
                className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <DollarSign className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Run Payroll</p>
                  <p className="text-sm text-muted-foreground">Process this month's payroll</p>
                </div>
              </a>
              <a
                href="/employees/new"
                className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Users className="w-5 h-5 mr-3 text-secondary" />
                <div>
                  <p className="font-medium">Add Employee</p>
                  <p className="text-sm text-muted-foreground">Onboard a new team member</p>
                </div>
              </a>
              <a
                href="/reports"
                className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <TrendingUp className="w-5 h-5 mr-3 text-accent" />
                <div>
                  <p className="font-medium">View Reports</p>
                  <p className="text-sm text-muted-foreground">Generate payroll reports</p>
                </div>
              </a>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.pendingApprovals > 0 && (
                <div className="flex items-start p-3 rounded-lg bg-warning/10">
                  <AlertCircle className="w-5 h-5 mr-3 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-warning-foreground">
                      {stats.pendingApprovals} Payroll{stats.pendingApprovals > 1 ? 's' : ''} Pending
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Review and approve pending payroll runs
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start p-3 rounded-lg bg-success/10">
                <TrendingUp className="w-5 h-5 mr-3 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-success-foreground">System Healthy</p>
                  <p className="text-sm text-muted-foreground">All systems operational</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

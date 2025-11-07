import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Reports = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
    <Card>
      <CardHeader>
        <CardTitle>Payroll Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Reports module coming soon</p>
      </CardContent>
    </Card>
  </div>
);

export default Reports;

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Plus } from 'lucide-react';

const Payroll = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
        <p className="text-muted-foreground">Process and manage payroll</p>
      </div>
      <Button>
        <Plus className="w-4 h-4 mr-2" />
        Run Payroll
      </Button>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Payroll Runs</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">No payroll runs available</p>
      </CardContent>
    </Card>
  </div>
);

export default Payroll;

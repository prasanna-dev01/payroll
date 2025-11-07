import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Attendance = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
    <Card>
      <CardHeader>
        <CardTitle>Attendance Records</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Attendance management coming soon</p>
      </CardContent>
    </Card>
  </div>
);

export default Attendance;

import { getCurrentUser } from '@/lib/session';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function ClientDashboard() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.fullName}!</h1>
            <p className="text-muted-foreground">Here's your tax preparation status</p>
          </div>
          <Button variant="outline" onClick={() => (window.location.href = '/api/auth/logout')}>
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Upload and manage your tax documents</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Chat with your tax advisor</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>Schedule meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>User Info</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium">Email:</dt>
                <dd>{user?.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Role:</dt>
                <dd className="capitalize">{user?.role}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">User ID:</dt>
                <dd>{user?.userId}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

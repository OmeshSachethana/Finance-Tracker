import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DangerZone } from '@/features/settings/DangerZone';
import { PasswordForm } from '@/features/settings/PasswordForm';
import { ProfileForm } from '@/features/settings/ProfileForm';

export function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage your profile and account security." />
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400">Danger zone</CardTitle>
          </CardHeader>
          <CardContent>
            <DangerZone />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

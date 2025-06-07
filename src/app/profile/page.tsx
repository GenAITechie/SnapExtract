'use client';

import { ProfileEditor } from '@/components/profile/ProfileEditor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserCircle2 } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8 flex justify-center">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <UserCircle2 className="mx-auto h-16 w-16 text-primary mb-3" />
          <CardTitle className="text-2xl font-headline">Profile Settings</CardTitle>
          <CardDescription>
            Manage your settings. Your email is used for data export features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileEditor />
        </CardContent>
      </Card>
    </div>
  );
}

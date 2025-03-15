import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Key, Shield } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your update logic here
    setIsEditing(false);
  };

  return (
    
    <div className="container mx-auto px-4 py-8 max-w-4xl">
<div >
{
  user?.isVerified == false && (
    <div className='bg-red-500 text-white p-4  mb-8 rounded-xl'>
      <h1>Please verify your email to continue</h1>
    </div>
  )
}
</div>
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <div className="grid gap-6">
        {/* Profile Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="space-y-4 border-t pt-4 mt-4">
                  <h3 className="font-medium">Change Password</h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full p-2 border rounded-md"
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full p-2 border rounded-md"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full p-2 border rounded-md"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
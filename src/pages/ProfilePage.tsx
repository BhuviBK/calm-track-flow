import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Mail } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].charAt(0).toUpperCase();
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">Profile</h1>
        
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-gradient-to-r from-forest-500 to-green-400 text-white">
                  {user?.email ? getInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">User Profile</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* User Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <p className="text-sm font-mono text-muted-foreground">{user?.id}</p>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="w-full flex items-center gap-2"
                size="lg"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfilePage;
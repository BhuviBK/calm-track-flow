
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logoutUser, addUserHistory } = useAppContext();
  
  useEffect(() => {
    // If no logged in user, redirect to login
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    // Add page visit to history
    addUserHistory({
      page: "Profile",
      action: "Viewed profile page",
      timestamp: new Date(),
    });
  }, [currentUser, navigate, addUserHistory]);
  
  if (!currentUser) {
    return null; // Will redirect to login via the useEffect
  }
  
  const handleLogout = () => {
    addUserHistory({
      page: "Profile",
      action: "Logged out",
      timestamp: new Date(),
    });
    
    logoutUser();
    navigate("/login");
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Profile</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Username</h3>
                  <p className="text-lg">{currentUser.username}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Last Login</h3>
                  <p>
                    {new Date(currentUser.lastLogin).toLocaleString()}
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button 
                    onClick={handleLogout}
                    variant="destructive"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;

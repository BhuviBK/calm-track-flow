
import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import Layout from "@/components/Layout";
import { useAppContext } from "@/contexts/AppContext";
import { Navigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const { currentUser, addUserHistory } = useAppContext();
  
  // Redirect if user is already logged in
  if (currentUser) {
    return <Navigate to="/" />;
  }
  
  // Record page visit in history
  React.useEffect(() => {
    if (currentUser) {
      addUserHistory({
        page: "Login",
        action: "Visited login page",
        timestamp: new Date(),
      });
    }
  }, [currentUser, addUserHistory]);

  return (
    <Layout>
      <div className="max-w-md mx-auto py-8">
        <LoginForm />
      </div>
    </Layout>
  );
};

export default LoginPage;

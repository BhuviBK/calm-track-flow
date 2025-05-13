
import React from "react";
import SignupForm from "@/components/auth/SignupForm";
import Layout from "@/components/Layout";
import { useAppContext } from "@/contexts/AppContext";
import { Navigate } from "react-router-dom";

const SignupPage: React.FC = () => {
  const { currentUser, addUserHistory } = useAppContext();
  
  // Redirect if user is already logged in
  if (currentUser) {
    return <Navigate to="/" />;
  }
  
  // Record page visit in history
  React.useEffect(() => {
    if (currentUser) {
      addUserHistory({
        page: "Sign Up",
        action: "Visited signup page",
        timestamp: new Date(),
      });
    }
  }, [currentUser, addUserHistory]);

  return (
    <Layout>
      <div className="max-w-md mx-auto py-8">
        <SignupForm />
      </div>
    </Layout>
  );
};

export default SignupPage;


import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import Layout from "@/components/Layout";
import { useAppContext } from "@/contexts/AppContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, addUserHistory } = useAppContext();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);
  
  // Record page visit in history
  useEffect(() => {
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

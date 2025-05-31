
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignupForm from "@/components/auth/SignupForm";
import Layout from "@/components/Layout";
import { useAppContext } from "@/contexts/AppContext";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppContext();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <Layout>
      <div className="max-w-md mx-auto py-8">
        <SignupForm />
      </div>
    </Layout>
  );
};

export default SignupPage;

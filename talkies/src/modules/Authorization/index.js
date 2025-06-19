import React from "react";
import Form from "./form";
const Auth = () => {
  const isSignInPage = window.location.pathname.includes("signin");
  return <Form isSignInPage={isSignInPage} />;
};

export default Auth;

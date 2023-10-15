import React from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

import "../main/style.css";

function Signout() {
  const handleSignout = async () => {
    try {
      await toast.promise(signOut(auth), {
        loading: "Signing you out...", // Loading message (optional)
        success: "Signed out successfully!", // Displayed on successful login
        error: (error) => {
          toast.dismiss();
          // Customize error messages based on error code
          switch (error.code) {
            case "auth/user-not-found":
              return "User not found. Please check your email.";
            case "auth/wrong-password":
              return "Incorrect password. Please try again.";
            case "auth/invalid-email":
              return "Invalid email address. Please enter a valid email.";
            case "auth/user-disabled":
              return "User account is disabled. Contact support for assistance.";
            case "auth/user-token-expired":
              return "User session has expired. Please sign in again.";
            case "auth/too-many-requests":
              return "Too many sign-in attempts. Please try again later.";
            case "auth/network-request-failed":
              return "Network error. Check your internet connection.";
            case "auth/internal-error":
              return "Internal error occurred. Please try again later.";
            case "auth/invalid-api-key":
              return "Invalid Firebase API key. Check your configuration.";
            case "auth/invalid-tenant-id":
              return "Invalid tenant ID. Check your setup.";
            case "auth/operation-not-supported-in-this-environment":
              return "Sign-in not supported in this environment.";
            default:
              return "An error occurred. Please try again.";
          }
        },
      });
    } catch (error) {}
  };

  return (
    <>
      <button className="Signout" onClick={handleSignout}>
        signout
      </button>
    </>
  );
}

export default Signout;

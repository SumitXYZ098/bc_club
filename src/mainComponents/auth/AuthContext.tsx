"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import LoginPopup from "./LoginPopup";
import SignupPopup from "./SignupPopup";
import ForgotPassword from "./ForgotPassword";
import OtpScreen from "./OtpScreen";
import NewPassword from "./NewPassword";
import AccountCreate from "./AccountCreate";
import { useListingStore } from "@/src/store/useListingStore";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  openLogin: boolean;
  setOpenLogin: (open: boolean) => void;
  openSignup: boolean;
  setOpenSignup: (open: boolean) => void;
  openAccCreation: boolean;
  setOpenAccCreation: (open: boolean) => void;
  openForgot: boolean;
  setOpenForgot: (open: boolean) => void;
  openOtp: boolean;
  setOpenOtp: (open: boolean) => void;
  openNewPassword: boolean;
  setOpenNewPassword: (open: boolean) => void;
  resetEmail: string;
  setResetEmail: (email: string) => void;
  resetToken: string;
  setResetToken: (token: string) => void;
  isLoggedIn: boolean;
  username: any;
  loginUser: (username: any, token?: string, keepLoggedIn?: boolean) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);
  const [openAccCreation, setOpenAccCreation] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);
  const [openOtp, setOpenOtp] = useState(false);
  const [openNewPassword, setOpenNewPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const { clearAllFilters } = useListingStore();
  const query = useQueryClient();

  useEffect(() => {
    const userCookie = Cookies.get("username");
    if (userCookie || Cookies.get("token")) {
      setIsLoggedIn(true);
      if (userCookie) {
        try {
          setUsername(JSON.parse(userCookie));
        } catch (error) {
          setUsername(userCookie);
        }
      }
    }
  }, []);

  const loginUser = (user: any, token?: string, keepLoggedIn?: boolean) => {
    setIsLoggedIn(true);
    setUsername(user);
    const options = keepLoggedIn ? { expires: 30 } : undefined;
    Cookies.set("username", JSON.stringify(user), options);
    if (token) Cookies.set("token", token, options);
  };

  const logoutUser = () => {
    query.clear();
    setIsLoggedIn(false);
    setUsername("");
    Cookies.remove("username");
    Cookies.remove("token");
    clearAllFilters();
  };

  // OTP verified callback
  const handleOtpVerified = () => {
    setOpenOtp(false);
    setOpenNewPassword(true);
  };

  return (
    <AuthContext.Provider
      value={{
        openLogin,
        setOpenLogin,
        openSignup,
        setOpenSignup,
        openAccCreation,
        setOpenAccCreation,
        openForgot,
        setOpenForgot,
        openOtp,
        setOpenOtp,
        openNewPassword,
        setOpenNewPassword,
        resetEmail,
        setResetEmail,
        resetToken,
        setResetToken,
        isLoggedIn,
        username,
        loginUser,
        logoutUser,
      }}
    >
      {children}

      {/* INITIALIZE POPUPS HERE SO THEY ARE AVAILABLE GLOBALLY */}
      <LoginPopup
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onOpenSignup={() => {
          setOpenLogin(false);
          setOpenSignup(true);
        }}
        onOpenForgot={() => {
          setOpenLogin(false);
          setOpenForgot(true);
        }}
      />

      <SignupPopup
        open={openSignup}
        onClose={() => setOpenSignup(false)}
        onOpenLogin={() => {
          setOpenSignup(false);
          setOpenLogin(true);
        }}
        onOpenAccCreation={() => {
          setOpenSignup(false);
          setOpenAccCreation(true);
        }}
      />

      <AccountCreate
        open={openAccCreation}
        onClose={() => setOpenAccCreation(false)}
        onOpenLogin={() => {
          setOpenAccCreation(false);
          setOpenLogin(true);
        }}
      />

      <ForgotPassword
        open={openForgot}
        onClose={() => setOpenForgot(false)}
        onOpenOtp={() => {
          setOpenForgot(false);
          setOpenOtp(true);
        }}
        onOpenSignup={() => {
          setOpenForgot(false);
          setOpenSignup(true);
        }}
        onOpenForgot={() => {
          setOpenForgot(false);
          setOpenForgot(true);
        }}
      />

      <OtpScreen
        open={openOtp}
        onClose={() => setOpenOtp(false)}
        onVerified={handleOtpVerified}
      />

      <NewPassword
        openLogin={() => {
          setOpenLogin(true);
          setOpenNewPassword(false);
        }}
        open={openNewPassword}
        onClose={() => setOpenNewPassword(false)}
      />
    </AuthContext.Provider>
  );
};

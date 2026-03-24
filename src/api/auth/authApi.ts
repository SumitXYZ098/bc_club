import axios from "axios";
import { Endpoints } from "../endpoints";

interface LoginPayload {
  identifier: string;
  password: string;
}
interface SignupPayload {
fullName: string;
  email: string;
  password: string;
}

interface ForgotPasswordPayload {
  email: string;
}
interface VerifyOtpPayload {
  email: string;
  otp: string;
}
interface ResetPasswordPayload {
  email: string;
  resetToken: string;
  newPassword: string;
}

// Login Api
export const login = async (payload: LoginPayload) => {
  try {
    const response = await axios.post(Endpoints.login, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// Signup Api
export const signup = async (payload: SignupPayload) => {
  try {
    const response = await axios.post(Endpoints.signup, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// Forgot Password Api
export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  try {
    const response = await axios.post(Endpoints.forgotPassword, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// Verify Otp Api
export const verifyOtp = async (payload: VerifyOtpPayload) => {
  try {
    const response = await axios.post(Endpoints.verifyOtp, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

// Reset Password Api
export const resetPassword = async (payload: ResetPasswordPayload) => {
  try {
    const response = await axios.post(Endpoints.resetPassword, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};

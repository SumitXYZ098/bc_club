"use client";
import CustomButton from "@/src/components/button/CustomButton";
import CustomDialog from "@/src/components/common/customDialog/CustomDialog";
import { TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { forgotPassword } from "@/src/api/auth/authApi";
import { useAuthContext } from "./AuthContext";

interface ForgotPasswordProps {
  open: boolean;
  onClose: () => void;
  onOpenSignup: () => void;
  onOpenForgot: () => void;
  onOpenOtp: () => void;
}

const ForgotPassword = ({ open, onClose, onOpenOtp }: ForgotPasswordProps) => {
  const { setResetEmail } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setErrorMsg("");
      await forgotPassword({ email: data.email });
      setResetEmail(data.email);
      onClose();
      onOpenOtp();
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="Forgot password"
      description="Please enter your email to reset the password"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}
        <TextField
          label="Email"
          type="email"
          className="w-full"
          {...register("email", { required: "Email is required" })}
          error={!!errors.email}
          helperText={errors.email?.message as string}
        />
        <CustomButton
          label={loading ? "Sending..." : "Reset Password"}
          buttonType="primary"
          customClasses="w-full mt-5"
          type="submit"
        />
      </form>
    </CustomDialog>
  );
};

export default ForgotPassword;

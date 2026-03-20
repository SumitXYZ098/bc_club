"use client";
import { useState } from "react";
import CustomDialog from "@/src/components/common/customDialog/CustomDialog";
import CustomButton from "@/src/components/button/CustomButton";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { resetPassword } from "@/src/api/auth/authApi";
import { useAuthContext } from "./AuthContext";
interface NewPasswordProps {
  open: boolean;
  onClose: () => void;
}

const NewPassword = ({ open, onClose }: NewPasswordProps) => {
  const { resetEmail, resetToken } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setErrorMsg("");
      await resetPassword({
        email: resetEmail,
        resetToken: resetToken,
        newPassword: data.newPassword,
      });
      console.log("Password Reset Success");
      onClose(); // Optional: or show a success toast
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="Set New Password"
      description="Enter your new password and confirm it below."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-4"
      >
        {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}
        {/* New Password */}
        <TextField
          label="New Password"
          type={showNewPassword ? "text" : "password"}
          className="w-full"
          {...register("newPassword", { required: "New password is required" })}
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message as string}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Confirm Password */}
        <TextField
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          className="w-full"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (val: string) => {
              if (watch("newPassword") != val) {
                return "Passwords do no match";
              }
            },
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message as string}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <CustomButton
          label={loading ? "Updating..." : "Update Password"}
          buttonType="primary"
          customClasses="w-full mt-4"
          type="submit"
        />
      </form>
    </CustomDialog>
  );
};

export default NewPassword;

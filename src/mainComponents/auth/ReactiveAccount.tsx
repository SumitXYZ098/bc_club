"use client";
import { useState } from "react";
import CustomDialog from "@/src/components/common/customDialog/CustomDialog";
import CustomButton from "@/src/components/button/CustomButton";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { reactiveAccount } from "@/src/api/auth/authApi";
import { useAuthContext } from "./AuthContext";
import { toast } from "react-toastify";
interface ReactiveAccountProps {
  open: boolean;
  onClose: () => void;
  openLogin: () => void;
}

const ReactiveAccount = ({
  open,
  onClose,
  openLogin,
}: ReactiveAccountProps) => {
  const { resetEmail } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setErrorMsg("");
      await reactiveAccount({
        identifier: resetEmail,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success("Account reactivated successfully. Please log in again.");
      onClose();
      reset();
      openLogin();
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to reactivate account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="Reactive Account"
      description="Your VOW access has expired. Please reset your password to reactivate."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-4"
      >
        {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}

        {/* Old Password */}
        <TextField
          label="Old Password"
          type={showOldPassword ? "text" : "password"}
          className="w-full"
          {...register("oldPassword", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
              message:
                "Password must include uppercase, lowercase, number, and special character",
            },
          })}
          error={!!errors.oldPassword}
          helperText={errors.oldPassword?.message as string}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {/* New Password */}
        <TextField
          label="Set New Password"
          type={showNewPassword ? "text" : "password"}
          className="w-full"
          {...register("newPassword", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
              message:
                "Password must include uppercase, lowercase, number, and special character",
            },
          })}
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

export default ReactiveAccount;

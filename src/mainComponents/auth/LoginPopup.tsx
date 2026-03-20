"use client";
import CustomButton from "@/src/components/button/CustomButton";
import CustomDialog from "@/src/components/common/customDialog/CustomDialog";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Icons } from "@/src/app/exports";
import React, { useState } from "react";
import Image from "next/image";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { login } from "@/src/api/auth/authApi";
import { useAuthContext } from "./AuthContext";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onOpenSignup: () => void;
  onOpenForgot: () => void;
}

const LoginPopup = ({
  open,
  onClose,
  onOpenSignup,
  onOpenForgot,
}: LoginModalProps) => {
  const { loginUser } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { email: "", password: "", keepLoggedIn: false },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setErrorMsg("");
      const response = await login({
        identifier: data.email,
        password: data.password,
      });
      console.log("Login Success:", response);
      const userStr = data.email.split("@")[0].toUpperCase();
      const actualUsername =
        response?.user?.username || response?.username || userStr;
      loginUser(
        actualUsername.toUpperCase(),
        response?.jwt || response?.token,
        data.keepLoggedIn,
      );
      onClose(); // Close on success
      reset();
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="WelCome Back"
      description="Let’s Login to grab amazing deal"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}
        {/* Email */}

        <TextField
          label="Email"
          type="email"
          className="w-full"
          {...register("email", { required: "Email is required" })}
          error={!!errors.email}
          helperText={errors.email?.message as string}
          InputProps={{
            style: {
              paddingTop: "3px",
            },
          }}
        />

        {/* Password */}
        <div className="relative mt-4">
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            className="w-full"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message as string}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        {/* Keep me logged in */}
        <div className="flex justify-between items-center mt-3">
          <FormControlLabel
            control={<Checkbox {...register("keepLoggedIn")} size="small" />}
            label={
              <span className="text-[14px] text-[#9b9a9a]">
                Keep me logged in
              </span>
            }
            sx={{ margin: 0 }}
          />

          <button
            onClick={onOpenForgot}
            className="text-[#22558B] text-sm hover:underline"
          >
            Forget password
          </button>
        </div>

        <CustomButton
          label={loading ? "Logging in..." : "Login"}
          buttonType="primary"
          customClasses="w-full  mt-5"
          type="submit"
        />

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-[#000F0D] text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <div className="bg-[#F3F3F3] flex justify-center gap-2 py-3 px-13 rounded-md">
          <button className="flex   transition text-[#232323]">
            Continue with
          </button>

          <Image
            width={100}
            height={100}
            alt="google"
            src={Icons.google}
            className="w-6 h-6 object-contain"
          />
        </div>

        <p className="text-center text-gray-600 text-sm mt-4">
          Need an account?
          <span
            onClick={onOpenSignup}
            className="text-yellow-500 font-medium hover:underline cursor-pointer"
          >
            Create one
          </span>
        </p>
      </form>
    </CustomDialog>
  );
};

export default LoginPopup;

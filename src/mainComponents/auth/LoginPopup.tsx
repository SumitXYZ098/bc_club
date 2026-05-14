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
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { login } from "@/src/api/auth/authApi";
import { useAuthContext } from "./AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

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
      loginUser(
        response.user,
        response?.jwt || response?.token,
        data.keepLoggedIn,
      );
      toast.success("Login successful!");
      onClose();
      reset();
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (idToken: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/google-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        },
      );

      const data = await res.json();

      if (data.message && !data.token) {
        toast.info(data.message); // "Please verify your email"
        return;
      }

      if (data.message && data.token) {
        localStorage.setItem("token", data.token);
        loginUser(data.user, data.token, false);
        onClose();
        toast.success("Login successful!");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Google Login Failed:", error);
      setErrorMsg("Google Login Failed");
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="WelCome Back"
      description="Log in to continue your home search"
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
            type="button"
            onClick={onOpenForgot}
            className="text-[#22558B] text-sm hover:underline"
          >
            Forgot password
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
        <div className="flex justify-center flex-col items-center gap-2 py-3 px-13 rounded-md">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              const idToken = credentialResponse.credential;
              if (idToken) handleGoogleLogin(idToken);
            }}
            onError={() => {
              setErrorMsg("Google Login Failed");
            }}
            text="continue_with"
            shape="pill"
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

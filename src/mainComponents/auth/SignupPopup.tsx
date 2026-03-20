import { Icons } from "@/src/app/exports";
import CustomButton from "@/src/components/button/CustomButton";
import CustomDialog from "@/src/components/common/customDialog/CustomDialog";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signup } from "@/src/api/auth/authApi";

interface SignupPopupProps {
  open: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  onOpenAccCreation: () => void;
}

const SignupPopup = ({
  open,
  onClose,
  onOpenLogin,
  onOpenAccCreation,
}: SignupPopupProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setErrorMsg("");
      const response = await signup({
        username: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        password: data.password,
      });
      if (response.message) {
        onOpenAccCreation(); // Redirect to login after successful signup
        reset();
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="Create an Account"
      description="Enter your information to create a BCclub"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}
        <div className="flex gap-4 mb-7.75">
          <TextField
            label="First Name"
            type="text"
            className="w-full "
            {...register("firstName", { required: "First Name is required" })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message as string}
          />
          <TextField
            label="Last Name"
            type="text"
            className="w-full"
            {...register("lastName", { required: "Last Name is required" })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message as string}
          />
        </div>
        {/* Email */}
        <TextField
          label="Email"
          type="email"
          className="w-full"
          {...register("email", { required: "Email is required" })}
          error={!!errors.email}
          helperText={errors.email?.message as string}
          sx={{
            "& .MuiOutlinedInput-input": {
              height: "auto",
              padding: 2,
            },
          }}
        />

        {/* Password */}
        <div className="relative mt-4">
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            className="w-full p-4"
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

        <CustomButton
          label={loading ? "Signing up..." : "Sign Up"}
          buttonType="primary"
          customClasses="w-full mt-5"
          type="submit"
        />

        <div className="flex items-center gap-3 mt-5 mb-2.5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-[#000F0D] text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <div className="bg-[#F3F3F3] flex justify-center gap-1 py-3 px-13 rounded-md">
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

        <p className="text-center flex justify-center text-gray-600 text-sm mt-4 gap-1.5">
          Already have an account?
          <span
            onClick={onOpenLogin}
            className="text-yellow-500 font-medium hover:underline cursor-pointer"
          >
            sign in{" "}
          </span>
        </p>
      </form>
    </CustomDialog>
  );
};

export default SignupPopup;

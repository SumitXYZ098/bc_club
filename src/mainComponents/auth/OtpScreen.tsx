"use client";
import CustomDialog from "@/src/components/common/customDialog/CustomDialog";
import OTPInput from "react-otp-input";
import { useState } from "react";
import CustomButton from "@/src/components/button/CustomButton";
import { useForm, Controller } from "react-hook-form";
import { verifyOtp } from "@/src/api/auth/authApi";
import { useAuthContext } from "./AuthContext";
interface OtpScreenProps {
  open: boolean;
  onClose: () => void;
  onVerified?: () => void;
}

const OtpScreen = ({ open, onClose, onVerified }: OtpScreenProps) => {
  const { resetEmail, setResetToken } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { otp: "" },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setErrorMsg("");
      const response = await verifyOtp({ email: resetEmail, otp: data.otp });
      // Store token for NewPassword screen. Fallback to otp if api doesn't return one.
      setResetToken(response?.resetToken || data.otp);
      onVerified?.();
    } catch (error: any) {
      setErrorMsg(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("Text");
    if (!/^\d*$/.test(paste)) e.preventDefault();
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      title="Check Your Email"
      description="Enter the 5-digit code sent to your email."
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}
        <div className="flex justify-center mt-6">
          <Controller
            name="otp"
            control={control}
            rules={{
              required: "OTP is required",
              minLength: {
                value: 5,
                message: "Please enter the 5-digit code.",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <OTPInput
                value={value}
                onChange={(val) => {
                  const numeric = val.replace(/[^0-9]/g, "");
                  onChange(numeric);
                }}
                numInputs={5}
                shouldAutoFocus
                renderInput={(props) => (
                  <input
                    {...props}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onPaste={handlePaste}
                    style={{
                      width: "50%",
                      height: "54px",
                      margin: "0 6px",
                      fontSize: "22px",
                      borderRadius: "8px",
                      border: "1px solid #30548729",
                      outline: "none",
                      background: "#fff",
                      textAlign: "center",
                    }}
                    className="focus:border-blue-600 focus:ring-1 focus:ring-blue-300"
                  />
                )}
              />
            )}
          />
        </div>
        {errors.otp && (
          <p
            className="text-[#d32f2f] text-[0.75rem] text-center mt-2 ml-3.5 tracking-[0.03333em] leading-normal font-normal mr-3.5"
            style={{ fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
          >
            {errors.otp.message as string}
          </p>
        )}

        <CustomButton
          label={loading ? "Verifying..." : "Verify Code"}
          buttonType="primary"
          customClasses="w-full mt-6"
          type="submit"
        />
      </form>
    </CustomDialog>
  );
};

export default OtpScreen;

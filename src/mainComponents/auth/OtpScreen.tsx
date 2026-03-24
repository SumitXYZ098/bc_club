"use client";
import CustomDialog from "@/src/components/common/customDialog/CustomDialog";
import OTPInput from "react-otp-input";
import { useState, useEffect } from "react";
import CustomButton from "@/src/components/button/CustomButton";
import { useForm, Controller } from "react-hook-form";
import { verifyOtp, forgotPassword } from "@/src/api/auth/authApi";
import { useAuthContext } from "./AuthContext";
import { toast } from "react-toastify";
interface OtpScreenProps {
  open: boolean;
  onClose: () => void;
  onVerified?: () => void;
}

const OtpScreen = ({ open, onClose, onVerified }: OtpScreenProps) => {
  const { resetEmail, setResetToken, setResetEmail } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

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
      setResetToken(response?.resetToken || data.otp);
      onVerified?.();
    } catch (error: any) {
      setErrorMsg(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (timer > 0) return;
    try {
      setLoading(true);
      setErrorMsg("");
      await forgotPassword({ email: resetEmail });
      toast.success(`Resend OTP code on your email ${resetEmail}`);
      setResetEmail(resetEmail);
      setTimer(60);
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to send reset email");
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
      description={`We’ve sent a 6 digit code to your email. Check your email ${resetEmail}`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {errorMsg && (
          <p className="text-red-500 text-sm md:mb-4 mb-1">{errorMsg}</p>
        )}
        <div className="flex justify-center md:mt-6">
          <Controller
            name="otp"
            control={control}
            rules={{
              required: "OTP is required",
              minLength: {
                value: 6,
                message: "Please enter the 6-digit code.",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <OTPInput
                value={value}
                onChange={(val) => {
                  const numeric = val.replace(/[^0-9]/g, "");
                  onChange(numeric);
                }}
                numInputs={6}
                shouldAutoFocus
                renderInput={(props) => (
                  <input
                    {...props}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onPaste={handlePaste}
                    style={{
                      width: "50%",
                      margin: "0 6px",
                      borderRadius: "8px",
                      border: "1px solid #30548729",
                      outline: "none",
                      background: "#fff",
                      textAlign: "center",
                    }}
                    className="focus:border-blue-600 focus:ring-1 focus:ring-blue-300 xl:text-[22px] md:text-xl text-sm xl:h-14 md:h-12 h-9"
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
        <button
          type="button"
          onClick={handleResendCode}
          disabled={timer > 0 || loading}
          className={`text-primary/60 text-sm mt-2 co ${
            timer > 0 || loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-primary cursor-pointer"
          }`}
        >
          {timer > 0 ? `Resend Code in ${timer}s` : "Resend Code"}
        </button>
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

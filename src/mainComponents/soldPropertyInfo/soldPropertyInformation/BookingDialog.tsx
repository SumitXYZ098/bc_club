import React, { useState, useEffect } from "react";
import {
  Dialog,
  TextField,
  Box,
  Fade,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";

import {
  LocalizationProvider,
  DatePicker,
  MobileTimePicker,
} from "@mui/x-date-pickers";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
import CustomButton from "@/src/components/button/CustomButton";
import { toast } from "react-toastify";
import { useAuthContext } from "../../auth/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
  property: any;
}

type FormValues = {
  name: string;
  email: string;
  phone: string;
  property: string;
  date: string;
  time: string;
};

const BookingDialog: React.FC<Props> = ({ open, onClose, property }) => {
  const steps = ["Details", "Schedule"];
  const [activeStep, setActiveStep] = useState(0);
  const { isLoggedIn, username } = useAuthContext();

  let name = "";
  let email = "";
  if (isLoggedIn) {
    name = username.fullName;
    email = username.email;
  }

  const {
    control,
    register,
    handleSubmit,
    trigger,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: isLoggedIn ? name : "",
      email: isLoggedIn ? email : "",
      phone: "",
      property: property?.address,
      date: dayjs().format("DD/MM/YYYY"),
      time: dayjs().format("hh:mm A"),
    },
  });

  useEffect(() => {
    if (isLoggedIn) {
      setValue("name", name);
      setValue("email", email);
    }
  }, [isLoggedIn, name, email, setValue]);

  const onSubmit = (data: FormValues) => {
    toast.success("Meeting Scheduled!");
    reset();
    onClose();
    setActiveStep(0);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        reset();
        setActiveStep(0);
      }}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: {
            xs: "16px",
            sm: "20px",
          },
        },
      }}
    >
      <Fade in={open}>
        <div className="w-full flex flex-col gap-y-6 md:p-8 p-4">
          {/* Progress */}
          <span className="md:text-2xl text-xl font-semibold text-center text-primary">
            Booking Schedule
          </span>

          <Stepper
            activeStep={activeStep}
            sx={{
              ".Mui-active, .Mui-completed": {
                color: "#22558b",
              },
            }}
          >
            {steps.map((label) => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* STEP 1 */}
              {activeStep === 0 && (
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    placeholder="Full Name"
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        borderRadius: "10px",
                      },
                    }}
                    type="text"
                    disabled={username?.fullName}
                    className="w-full "
                    {...register("name", {
                      required: "Name is required",
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message as string}
                  />

                  {/* Property */}
                  <Box position="relative">
                    <Controller
                      name="property"
                      control={control}
                      rules={{ required: "Property is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label=""
                          multiline
                          disabled={property?.address}
                          placeholder="Search Property (e.g. Surrey, Vancouver)"
                          fullWidth
                          sx={{
                            "& .MuiInputBase-root": {
                              borderRadius: "10px",
                            },
                          }}
                          error={!!errors.property}
                          helperText={errors.property?.message as string}
                        />
                      )}
                    />
                  </Box>

                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        placeholder="Email"
                        fullWidth
                        disabled={username?.email}
                        sx={{
                          "& .MuiInputBase-root": {
                            borderRadius: "10px",
                          },
                        }}
                        error={!!errors.email}
                        helperText={errors.email?.message as string}
                      />
                    )}
                  />

                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Must be a valid 10-digit phone number",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        placeholder="Phone (e.g. 1234567890)"
                        fullWidth
                        sx={{
                          "& .MuiInputBase-root": {
                            borderRadius: "10px",
                          },
                        }}
                        error={!!errors.phone}
                        helperText={errors.phone?.message as string}
                      />
                    )}
                  />

                  <CustomButton
                    buttonType="primary"
                    label="Continue →"
                    onClick={async () => {
                      const isValid = await trigger([
                        "name",
                        "property",
                        "email",
                        "phone",
                      ]);
                      if (isValid) {
                        setActiveStep(1);
                      }
                    }}
                  />
                </Box>
              )}

              {/* STEP 2 */}
              {activeStep === 1 && (
                <Box display="flex" flexDirection="column" gap={3}>
                  {/* Date Picker */}
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: "Date is required" }}
                    render={({ field }) => (
                      <DatePicker
                        label="Select Date"
                        value={
                          field.value ? dayjs(field.value, "DD/MM/YYYY") : null
                        }
                        format="DD/MM/YYYY"
                        disablePast
                        onChange={(newValue) => {
                          field.onChange(
                            newValue ? newValue.format("DD/MM/YYYY") : null,
                          );
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.date,
                            helperText: errors.date?.message as string,
                          },
                        }}
                      />
                    )}
                  />

                  {/* Time Picker */}
                  <Controller
                    name="time"
                    control={control}
                    rules={{ required: "Time is required" }}
                    render={({ field }) => (
                      <MobileTimePicker
                        label="Select Time"
                        value={
                          field.value ? dayjs(field.value, "hh:mm A") : null
                        }
                        onChange={(newValue) => {
                          field.onChange(
                            newValue ? newValue.format("hh:mm A") : null,
                          );
                        }}
                        disablePast
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.time,
                            helperText: errors.time?.message as string,
                          },
                        }}
                      />
                    )}
                  />

                  <Box display="flex" gap={2} width={"100%"}>
                    <CustomButton
                      buttonType="secondary-outlined"
                      label="Back"
                      customClasses="w-full"
                      onClick={() => setActiveStep(0)}
                    />
                    {/* Replaced logic for confirm. Since the outer container is <form onSubmit={handleSubmit(onSubmit)}>, we can use a native button submit type here */}
                    <button
                      type="submit"
                      className="text-xs md:text-sm xl:text-base md:py-2.5 py-2.5 px-2.5 rounded-lg h-auto cursor-pointer bg-secondary text-background w-full"
                    >
                      Confirm Booking
                    </button>
                  </Box>
                </Box>
              )}
            </form>
          </LocalizationProvider>
        </div>
      </Fade>
    </Dialog>
  );
};

export default BookingDialog;

"use client";
import { contactApi } from "@/src/api/contact/contactApi";
import { useForm } from "react-hook-form";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

export default function GetInTouchForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  //   const onSubmit = (data: FormValues) => {
  //     console.log("Form Submitted:", data);
  //     reset();
  //   };

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        message: data.message,
      };
      const response = await contactApi(formData);
      if (response.message === "Email sent successfully!") {
        reset();
        alert("Form submitted successfully! We will get back to you soon.");
      } else {
        alert("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full xl:w-1/2 mx-auto md:space-y-5 space-y-3"
    >
      {/* First + Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">First Name</label>
          <input
            type="text"
            {...register("firstName", { required: "First name is required" })}
            placeholder="Enter your first name"
            className="w-full border border-borderColor placeholder:text-borderColor text-foreground rounded-lg py-3 px-4 outline-none"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Last Name</label>
          <input
            type="text"
            {...register("lastName", { required: "Last name is required" })}
            placeholder="Enter your last name"
            className="w-full border border-borderColor placeholder:text-borderColor text-foreground rounded-lg py-3 px-4 outline-none"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block font-medium mb-1">Email Address</label>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email",
            },
          })}
          placeholder="Enter your email address"
          className="w-full border border-borderColor placeholder:text-borderColor text-foreground rounded-lg py-3 px-4 outline-none"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block font-medium mb-1">Phone Number</label>
        <input
          type="tel"
          {...register("phone", {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]+$/,
              message: "Phone must contain numbers only",
            },
            minLength: { value: 10, message: "Minimum 10 digits" },
            maxLength: { value: 15, message: "Maximum 15 digits" },
          })}
          placeholder="Enter your phone no."
          className="w-full border border-borderColor placeholder:text-borderColor text-foreground rounded-lg py-3 px-4 outline-none"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block font-medium mb-1">Message</label>
        <textarea
          {...register("message")}
          placeholder="Write message..."
          rows={5}
          className="w-full border border-borderColor placeholder:text-borderColor text-foreground rounded-lg py-3 px-4 outline-none"
        ></textarea>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className=" bg-primary text-background py-3 rounded-xl mt-4 text-lg font-medium w-1/2"
      >
        Submit
      </button>
    </form>
  );
}

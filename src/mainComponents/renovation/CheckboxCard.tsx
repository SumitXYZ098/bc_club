/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Control, Controller } from "react-hook-form";
import { motion } from "framer-motion";

interface CheckboxCardProps {
  name: string;
  label: string;
  control?: Control<any>; // RHF
  checked?: boolean; // controlled
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

const Card = ({ value, onChangeHandler, disabled, label }: any) => (
  <motion.label
    whileTap={{ scale: disabled ? 1 : 0.97 }}
    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition cursor-pointer
        ${
          disabled
            ? "opacity-50 cursor-not-allowed border-gray"
            : value
              ? "border-primary"
              : "border-gray"
        }`}
  >
    <input
      type="checkbox"
      className="hidden"
      checked={value}
      disabled={disabled}
      onChange={(e) => {
        if (disabled) return;
        onChangeHandler(e.target.checked);
      }}
    />

    <motion.div
      animate={{
        backgroundColor: value ? "#305487" : "#ffffff",
        borderColor: value ? "#305487" : "#0f0f0f",
      }}
      className="w-5 h-5 rounded border-2 flex items-center justify-center"
    >
      {value && <span className="text-white text-lg">✓</span>}
    </motion.div>

    <span
      className={`text-base text-black70 transition ${
        value ? " opacity-50 " : ""
      }`}
    >
      {label}
    </span>
  </motion.label>
);

const CheckboxCard = ({
  name,
  label,
  control,
  checked,
  onChange,
  disabled = false,
}: CheckboxCardProps) => {
  // 🔹 RHF controlled
  if (control) {
    return (
      <Controller
        name={name}
        control={control}
        defaultValue={false}
        render={({ field }) => (
          <Card
            value={field.value}
            onChangeHandler={field.onChange}
            label={label}
            disabled={disabled}
          />
        )}
      />
    );
  }

  // 🔹 Controlled / uncontrolled
  return (
    <Card
      value={checked}
      onChangeHandler={(val: boolean) => onChange?.(val)}
      label={label}
      disabled={disabled}
    />
  );
};

export default CheckboxCard;

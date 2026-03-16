"use client";

import React from "react";
import { Select, MenuItem } from "@mui/material";

interface Option {
  label: string;
  value: string;
}

interface FilterPillSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  pillBase: string;
  pillActive: string;
  pillInactive: string;
}

export default function FilterPillSelect({
  label,
  value,
  onChange,
  options,
  pillBase,
  pillActive,
  pillInactive,
}: FilterPillSelectProps) {
  return (
    <div
      className={`${pillBase} ${
        value === "any" ? pillInactive : pillActive
      } relative w-full xl:flex hidden text-nowrap items-center gap-x-3`}
    >
      <span>{label}:</span>

      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        variant="standard"
        disableUnderline
        className="w-full"
        sx={{
          "& .MuiSelect-select": {
            padding: 0,
            fontSize: "14px",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}

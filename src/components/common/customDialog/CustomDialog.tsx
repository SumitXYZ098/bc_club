"use client";

import * as React from "react";
import { Dialog } from "@mui/material";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function CustomDialog({
  open,
  onClose,
  title,
  description,
  children,
}: CustomModalProps) {
  const [firstWord, ...restWords] = title.split(" ");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: "100%",
            maxWidth: {
              sm: 450,
              xs: 350,
              lg: 550,
            },
            borderRadius: 5,
            margin: "24px",
            scrollbarWidth: "none",
          },
        },
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl md:p-8 px-4 py-6 w-full">
        <h2 className="text-4xl font-bold text-center">
          <span className="text-yellow-500">{firstWord}</span>{" "}
          {restWords.join(" ")}
        </h2>

        <p className="text-[#9b9a9a] text-[14px] plusJakartaDisplay  text-center mt-1 mb-6">
          {description}
        </p>

        <>{children}</>
      </div>
    </Dialog>
  );
}

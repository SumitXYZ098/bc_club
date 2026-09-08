import { ButtonProps } from "@mui/material";

interface CustomButtonProps extends ButtonProps {
  onClick?: () => void;
  customClasses?: string;
  disabled?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  cityName?: string;
  isActive?: boolean;
  title?: string;
}

const DotButton = ({
  onClick,
  customClasses,
  disabled,
  onMouseEnter,
  onMouseLeave,
  cityName,
  isActive,
  title,
}: CustomButtonProps) => {
  return (
    <button
      type="button"
      className={`w-6 h-3 rounded-sm cursor-pointer bg-transparent lg:flex hidden transition-all duration-200 ${
        isActive ? "ring-2 ring-primary/40 rounded-full" : ""
      } ${customClasses || ""}`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      title={title || cityName}
      aria-label={title || cityName || "City stats"}
    />
  );
};

export default DotButton;


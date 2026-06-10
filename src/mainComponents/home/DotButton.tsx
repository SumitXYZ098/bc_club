import { ButtonProps } from "@mui/material";
interface CustomButtonProps extends ButtonProps {
  onClick?: () => void;
  customClasses?: string;
  disabled?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const DotButton = ({
  onClick,
  customClasses,
  disabled,
  onMouseEnter,
  onMouseLeave,
}: CustomButtonProps) => {
  return (
    <button
      className={`w-6 h-3 rounded-sm cursor-pointer bg-transparent lg:flex hidden ${customClasses}`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};

export default DotButton;

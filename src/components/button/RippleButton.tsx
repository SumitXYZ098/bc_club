'use client';
import React, { useState, useEffect } from 'react';
import Description, { IDescriptionTypes } from '../description/Description';

interface RippleProps {
  title: string;
  onClick?: () => void;
  customClassName?: string;
  buttonType?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'inactive';
  textClassName?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

interface RippleState {
  x: number;
  y: number;
  isRippling: boolean;
  isHovered: boolean;
}

const RippleButton: React.FC<RippleProps> = ({
  title,
  onClick,
  buttonType = 'primary',
  customClassName = '',
  textClassName = '',
  type = 'button',
  icon,
}) => {
  const [ripple, setRipple] = useState<RippleState | null>(null);

  const getButtonStyles = () => {
    switch (buttonType) {
      case 'primary':
        return 'bg-primary text-white ';
      case 'secondary':
        return 'bg-transparent text-secondary border border-secondary ';
      case 'tertiary':
        return 'bg-secondary text-white ';
      case 'quaternary':
        return 'bg-background text-primary ';
      default:
        return 'bg-primary text-white ';
    }
  };

  useEffect(() => {
    if (ripple && !ripple.isRippling && !ripple.isHovered) {
      const timer = setTimeout(() => {
        setRipple(null);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [ripple]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const x = button.offsetWidth / 2;
    const y = button.offsetHeight;

    setRipple({ x, y, isRippling: true, isHovered: true });
  };

  const handleMouseLeave = () => {
    if (ripple) {
      setRipple((prev) =>
        prev ? { ...prev, isRippling: false, isHovered: false } : null
      );
    }
  };

  return (
    <button
      className={`group relative overflow-hidden inline-flex items-center justify-center text-xs md:text-sm xl:text-base md:py-2.5 py-2.5 px-2.5  rounded-lg outline-none cursor-pointer transition-all duration-1000 ${getButtonStyles()} ${customClassName}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      type={type}
    >
      {ripple && (
        <span
          className={`absolute pointer-events-none rounded-full 
                     ${
                       buttonType === 'tertiary' ? 'bg-primary' : 'bg-secondary'
                     }
                     ${
                       ripple.isRippling
                         ? 'animate-ripple'
                         : 'animate-ripple-reverse'
                     } `}
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
      <div className="flex w-full items-center gap-x-2 justify-center z-10">
        <Description
          customClasses={`transition-colors duration-500 pointer-events-none tracking-wide ${
            buttonType === 'secondary'
              ? ripple && ripple.isHovered
                ? 'animate-ripple-text-secondary'
                : 'animate-ripple-text-secondary-reverse'
              : buttonType === 'tertiary'
                ? 'text-white'
                : buttonType === 'quaternary'
                  ? 'text-primary'
                  : buttonType === 'inactive'
                    ? 'text-lightWhite'
                    : 'text-white'
          }  md:!text-base !text-sm  ${textClassName} `}
          type={IDescriptionTypes.dec20}
          content={title}
        />
        {icon && <div className="pointer-events-none">{icon}</div>}
      </div>
    </button>
  );
};

export default RippleButton;

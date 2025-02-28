import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content (can be a string, element, etc.)
  onClick?: () => void; // Function to call when the button is clicked
  className?: string; // Optional custom class names
  variant?: "primary" | "secondary"; // Button color variants
  size?: "sm" | "md" | "lg"; // Button size variants
  disabled?: boolean; // Whether the button is disabled
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
}) => {
  // Define variant styles using black and white colors
  const variantStyles = {
    primary:
      "bg-button-primary text-white border border-black hover:brightness-120",
    secondary:
      "bg-button-secondary text-white border border-black hover:brightness-120",
  };

  // Define size styles
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Combine classes for button
  const baseClasses = `inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 ease-in-out focus:outline-none disabled:opacity-50 cursor-pointer`;
  const classes = `${baseClasses} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;

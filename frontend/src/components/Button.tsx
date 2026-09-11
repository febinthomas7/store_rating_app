import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: (e: any) => void;
  [key: string]: any;
}

export const Button = ({
  children,
  isLoading = false,
  loadingText,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  className = "",
  onClick,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;

  const handleClick = (e: any) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-gray-900 text-white hover:bg-black focus:ring-gray-700",
    danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500",
    outline:
      "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-5 py-2.5 text-base rounded-xl",
  };

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      onClick={handleClick}
      className={`inline-flex items-center justify-center font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-1 select-none ${
        variants[variant]
      } ${sizes[size]} ${
        isDisabled ? "opacity-60 cursor-not-allowed pointer-events-none" : ""
      } ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{loadingText || children}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

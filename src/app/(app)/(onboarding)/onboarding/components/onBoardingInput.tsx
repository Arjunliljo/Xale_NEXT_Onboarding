import React, { forwardRef } from "react";
import { type FieldError } from "react-hook-form";
import InputErrorMessage from "@/src/components/Texts/InputErrorMessage";

interface OnBoardingInputsProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  Icon?: React.ComponentType<{ color?: string; size?: number }>;
  error?: FieldError; // React Hook Form error object
  containerClassName?: string;
}

const OnBoardingInputs = forwardRef<HTMLInputElement, OnBoardingInputsProps>(
  (
    {
      label = "Company name",
      placeholder = "Enter your company's name",
      className = "",
      containerClassName = "",
      Icon,
      error,
      type = "text",
      required,
      ...props
    },
    ref
  ) => {
    // Specific shadow from your original OnBoardingInputs
    const figmaShadow =
      "0px 144px 40px 0px rgba(0, 0, 0, 0.00), 0px 92px 37px 0px rgba(0, 0, 0, 0.00), 0px 52px 31px 0px rgba(0, 0, 0, 0.01), 0px 23px 23px 0px rgba(0, 0, 0, 0.02), 0px 6px 13px 0px rgba(0, 0, 0, 0.02)";

    // Dynamic styles based on Error State
    const borderClass = error
      ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
      : "border-[#E6E8E7] focus:ring-emerald-500/20 focus:border-emerald-500";

    const iconColor = error ? "#ef4444" : "#697571"; // Red if error, else Gray

    return (
      <div className={`mb-7 w-full max-w-[45rem] ${containerClassName}`} >
        {label && (
          <label className="block text-sm font-medium text-emerald-950 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative group">
          {/* Icon Container */}
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200">
              <Icon color={iconColor} />
            </div>
          )}

          <input
            ref={ref} // Forwarding ref for React Hook Form
            type={type}
            required={required}
            style={{
              boxShadow: figmaShadow,
              // height: "2rem", // Removed fixed height to let padding control it, avoiding cut-off text
            }}
            className={`
              block w-full 
              ${Icon ? "pl-10" : "pl-4"} pr-3 
              py-3.5 
              bg-white 
              border-[1.5px] 
              rounded-xl 
              text-gray-900 
              placeholder:text-gray-500
              focus:outline-none focus:ring-2 
              transition-all duration-200
              ${borderClass}
              ${className}
            `}
            placeholder={placeholder}
            {...props}
          />
        </div>

        {/* Dynamic Error Message */}
        {error && <InputErrorMessage>{error.message}</InputErrorMessage>}
      </div>
    );
  }
);

OnBoardingInputs.displayName = "OnBoardingInputs";

export default OnBoardingInputs;



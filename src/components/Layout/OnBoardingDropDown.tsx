"use client";

import React, { forwardRef, useState, useEffect } from "react";
import { type FieldError } from "react-hook-form";
import InputErrorMessage from "@/src/components/Texts/InputErrorMessage";
import { ChevronDownIcon } from "@/src/lib/utilities/icons";

// Define the shape of an option
export interface SelectOption {
  label: string;
  value: string | number;
}

interface OnBoardingSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  options?: SelectOption[];
  error?: FieldError;
  containerClassName?: string;
}

const OnBoardingDropDown = forwardRef<HTMLSelectElement, OnBoardingSelectProps>(
  (
    {
      label = "Select Option",
      className = "",
      containerClassName = "",
      Icon,
      options = [],
      error,
      required,
      value, // Controlled value
      defaultValue, // Uncontrolled default value
      onChange,
      ...props
    },
    ref
  ) => {
    const figmaShadow =
      "0px 144px 40px 0px rgba(0, 0, 0, 0.00), 0px 92px 37px 0px rgba(0, 0, 0, 0.00), 0px 52px 31px 0px rgba(0, 0, 0, 0.01), 0px 23px 23px 0px rgba(0, 0, 0, 0.02), 0px 6px 13px 0px rgba(0, 0, 0, 0.02)";

    const [currentValue, setCurrentValue] = useState<
      string | number | readonly string[]
    >(
      value !== undefined
        ? value
        : defaultValue !== undefined
        ? defaultValue
        : ""
    );

    // Sync local state if parent controls 'value'
    useEffect(() => {
      if (value !== undefined) {
        setCurrentValue(value);
      }
    }, [value]);

    // Handle change to update local state (for styling) + call parent handler
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCurrentValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    // Determine if placeholder is active based on local state
    const isPlaceholderActive =
      currentValue === "" || currentValue === undefined;

    // -------------------------------------------------------------------------
    // Styles
    // -------------------------------------------------------------------------
    const borderClass = error
      ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
      : "border-[#E6E8E7] focus:ring-emerald-500/20 focus:border-emerald-500";

    const iconColor = error ? "#ef4444" : "#697571";

    return (
      <div className={`mb-7 w-full max-w-[45rem] ${containerClassName}`} >
        {label && (
          <label className="block text-sm font-medium text-emerald-950 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative group">
          {/* Left Icon */}
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200">
            <Icon color={iconColor} />
          </div>

          {/* Select Input */}
          <select
            ref={ref}
            required={required}
            value={value} // Pass value if controlled
            defaultValue={value === undefined ? "" : undefined} // Force placeholder selection if uncontrolled
            onChange={handleChange}
            style={{
              boxShadow: figmaShadow,
            }}
            className={`
              appearance-none 
              block w-full 
              pl-10 pr-10 
              py-3.5 
              bg-white 
              border-[1.5px] 
              rounded-xl 
              focus:outline-none focus:ring-2 
              transition-all duration-200
              cursor-pointer
              ${isPlaceholderActive ? "text-gray-400" : "text-gray-900"}
              ${borderClass}
              ${className}
            `}
            {...props}
          >
            {/* Placeholder Option */}
            <option value="" disabled className="text-gray-400">
              Select Industry
            </option>

            {/* Mapped Options */}
            {options?.map((option) => (
              <option
                key={option?.value}
                value={option?.value}
                className="text-gray-900"
              >
                {option?.label}
              </option>
            ))}
          </select>

          {/* Right Chevron Icon */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            <ChevronDownIcon />
          </div>
        </div>

        {/* Dynamic Error Message */}
        {error && <InputErrorMessage>{error.message}</InputErrorMessage>}
      </div>
    );
  }
);

OnBoardingDropDown.displayName = "OnBoardingDropDown";

export default OnBoardingDropDown;

// Helper Icon


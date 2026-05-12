import React from "react";

interface LightGreenBtnProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  Icon?: React.ComponentType<{ size?: number; color?: string }>;
  style?: React.CSSProperties;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

export function LightGreenBtn({
  onClick,
  disabled = false,
  Icon,
  style = {},
  children,
  className,
  type = "button",
}: LightGreenBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={style}
      className={`light-green-btn ${className}`}
    >
      {Icon && <Icon />}
      <span className="truncate min-w-0">{children}</span>
    </button>
  );
}

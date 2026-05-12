import type { ReactNode } from "react";
import LayoutFooter from "./LayoutFooter";

type LayoutWrapperProps = {
  children: ReactNode;
};

function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between p-4 max-sm:px-3 max-sm:pt-4 max-sm:pb-6 font-[var(--font-helvetica-neue)] relative overflow-hidden bg-[var(--body-gradient)]"
      style={{
        background: "var(--body-gradient)",
      }}
    >
      {children}
      <LayoutFooter />
    </div>
  );
}

export default LayoutWrapper;

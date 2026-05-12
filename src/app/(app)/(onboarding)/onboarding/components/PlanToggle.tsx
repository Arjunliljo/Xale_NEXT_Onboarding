import { LightGreenBtn } from "@/src/components/Buttons/LightGreenButton";
import { PrimaryButton } from "@/src/components/Buttons/PrimaryButton";

interface PlanToggleProps {
  value: Boolean;
  onClick: () => void;
}

export default function PlanToggle({ value, onClick }: PlanToggleProps) {
  return (
    <div
      style={{ border: "1px solid var(--color-border-green)" }}
      // grid layout; responsive width with max cap for desktop
      className="grid grid-cols-2 w-full max-w-[340px] min-w-[260px] h-[52px] min-h-[52px] rounded-[1.3rem] p-1 items-center cursor-pointer text-sm sm:text-base"
    >
      {value ? (
        <>
          {/* Active State (Monthly) */}
          <LightGreenBtn className="w-full h-full !rounded-[1.1rem] px-3 sm:px-4">
            <div className="flex justify-center items-center w-full h-full whitespace-nowrap leading-none">
              <div>Monthly</div>
            </div>
          </LightGreenBtn>

          {/* Inactive State (Annually) */}
          <div
            className="flex items-center justify-center w-full h-full px-3 sm:px-4 whitespace-nowrap leading-none"
            onClick={onClick}
          >
            <div className="flex gap-1 items-center">
              <div>Annually</div>
              <span
                className="inline-flex items-center justify-center text-white text-[11px] font-medium rounded-full leading-none"
                style={{
                  background:
                    "radial-gradient(239.95% 185.59% at 63.38% -7.95%, #319B72 0%, #102F23 33.08%, #319B72 97.6%)",
                  padding: "0 6px",
                  height: "1.25rem",
                  boxShadow: "0 1px 1px 0 rgba(5, 25, 18, 0.20)",
                }}
              >
                -20%
              </span>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Inactive State (Monthly) */}
          <div
            className="flex items-center justify-center w-full h-full px-3 sm:px-4 whitespace-nowrap leading-none"
            onClick={onClick}
          >
            <span>Monthly</span>
          </div>

          {/* Active State (Annually) */}
          <LightGreenBtn className="w-full h-full !rounded-[1.1rem] px-3 sm:px-4">
            <div className="flex justify-center items-center gap-1 w-full h-full whitespace-nowrap leading-none">
              <div>Annually</div>
            <span
              className="inline-flex items-center justify-center text-white text-[11px] font-medium rounded-full leading-none"
              style={{
                background:
                  "radial-gradient(239.95% 185.59% at 63.38% -7.95%, #319B72 0%, #102F23 33.08%, #319B72 97.6%)",
                padding: "0 6px",
                height: "1.25rem",
                boxShadow: "0 1px 1px 0 rgba(5, 25, 18, 0.20)",
              }}
            >
              -20%
            </span>
            </div>
          </LightGreenBtn>
        </>
      )}
    </div>
  );
}

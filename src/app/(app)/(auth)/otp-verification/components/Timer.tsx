import React, { useEffect, useState } from "react";

interface TimerProps {
  seconds: number;
  children?: React.ReactNode;
}

export default function Timer({ seconds, children }: TimerProps) {
  const [timer, setTimer] = useState(seconds);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer > 0]);

  return (
    <div className="text-b4 text-var(--color-text-gray)">
      Didn't get it?{" "}
      {timer > 0 ? (
        <span className="text-var(--color-text-secondary)">
          Resend code in <span className="font-medium">{timer}s</span>
        </span>
      ) : (
        children
      )}
    </div>
  );
}

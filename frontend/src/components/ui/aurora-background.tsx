"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  showRadialGradient = true,
  ...props
}: Omit<AuroraBackgroundProps, "children">) => {
  return (
    <div
      className={cn(
        "absolute inset-0 z-0 overflow-hidden pointer-events-none",
        className,
      )}
      {...props}
    >
      <div
          className="absolute inset-0 overflow-hidden"
          style={
            {
              "--aurora":
                "repeating-linear-gradient(100deg,#bae6fd_10%,#38bdf8_20%,#0ea5e9_30%,#e0f2fe_40%,#7dd3fc_50%)",
              "--white-gradient":
                "repeating-linear-gradient(100deg,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.4)_10%,transparent_20%,transparent_30%,rgba(255,255,255,0.8)_40%)",
              "--transparent": "transparent",
            } as React.CSSProperties
          }
        >
          <div
            className={cn(
              `after:animate-aurora pointer-events-none absolute -inset-[10px] opacity-[0.8] blur-[20px] filter will-change-transform [background-image:var(--white-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-overlay after:content-[""]`,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,white_10%,var(--transparent)_70%)]`,
            )}
          ></div>
        </div>
    </div>
  );
};

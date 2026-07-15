import { cn } from "@/lib/utils";
import React from "react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-6 md:auto-rows-min md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento flex flex-col justify-between space-y-4 rounded-3xl bg-gradient-to-br from-sky-400 to-indigo-500 p-6 shadow-[0_12px_36px_-6px_rgba(14,165,233,0.15)] transition duration-300 hover:shadow-[0_20px_40px_-8px_rgba(14,165,233,0.25)] overflow-hidden",
        className,
      )}
    >
      {header}
      <div className="transition duration-300 group-hover/bento:translate-x-2 relative z-10">
        <div className="mb-1 font-sans text-xl font-bold text-white">
          {title}
        </div>
        <div className="font-sans text-sm font-medium text-sky-100/90 leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};

import type { CSSProperties, ReactNode } from "react";

interface BracketMatchNodeProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function BracketMatchNode({
  children,
  style,
  className = "",
}: BracketMatchNodeProps) {
  return (
    <div
      className={`bracket-node relative z-10 flex min-h-0 items-center justify-center overflow-visible ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

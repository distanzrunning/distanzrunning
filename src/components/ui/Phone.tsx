"use client";

import { forwardRef } from "react";

// ============================================================================
// Types
// ============================================================================

/** Props for the Phone component */
export interface PhoneProps {
  /** Content to display inside the phone screen */
  children?: React.ReactNode;
  /** URL to display in the bottom nav bar */
  url?: string;
  /** Additional CSS classes */
  className?: string;
}

// ============================================================================
// Phone Component
// ============================================================================

const buttonShadow =
  "0px 0px 1.5px rgba(0,0,0,0.1),0px 0.65px 5px rgba(0,0,0,0.12),inset 0.65px 0.65px 1px -0.65px rgba(255,255,255,0.8),inset -0.65px -0.65px 2px -0.65px rgba(255,255,255,0.4)";

/**
 * A realistic iPhone-style phone frame component using pure CSS/Tailwind.
 * Renders children inside a phone screen with dynamic island, home indicator,
 * bottom navigation bar, and side buttons.
 */
export const Phone = forwardRef<HTMLDivElement, PhoneProps>(
  ({ children, url = "distanzrunning.com", className = "" }, ref) => {
    return (
      <div style={{ containerType: "inline-size" }} className={className} ref={ref}>
        <div className="relative w-full outline outline-[2px] rounded-[52px] p-[2.5%] [&]:rounded-[15cqw] bg-[#000] outline-[#333]">
          {/* Screen */}
          <div className="rounded-[44px] overflow-hidden aspect-[9/19.5] relative [&]:rounded-[calc(15cqw-6px)]">
            {/* Default gray background if no children */}
            <div className="absolute inset-0 bg-[#878787]" />
            {children}
            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 w-full h-[18%] bg-gradient-to-b from-transparent via-[#000]/20 to-[#000]/70" />
          </div>

          {/* Dynamic Island (notch) */}
          <div className="absolute top-[2.5%] left-1/2 transform -translate-x-1/2 w-[30%] h-[4%] bg-[#000] rounded-full" />

          {/* Home indicator */}
          <div className="bg-[#fff] w-[34%] h-[0.6%] rounded-full absolute bottom-[3%] left-1/2 -translate-x-1/2" />

          {/* Bottom navigation bar */}
          <div className="absolute bottom-[6%] left-0 w-full flex items-center justify-between px-[6%] gap-2">
            {/* Back button */}
            <div
              className="text-[#fff]/80 bg-[rgba(15,15,15,0.32)] backdrop-blur-sm rounded-full flex items-center justify-center w-[12cqw] h-[12cqw]"
              style={{ boxShadow: buttonShadow }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5 14.0607L9.96966 13.5303L5.14644 8.7071C4.75592 8.31658 4.75592 7.68341 5.14644 7.29289L9.96966 2.46966L10.5 1.93933L11.5607 2.99999L11.0303 3.53032L6.56065 7.99999L11.0303 12.4697L11.5607 13L10.5 14.0607Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            {/* URL bar */}
            <div
              className="text-[#fff]/80 bg-[rgba(15,15,15,0.32)] backdrop-blur-sm rounded-full flex items-center justify-center h-[12cqw] w-auto flex-1"
              style={{ boxShadow: buttonShadow }}
            >
              <span className="text-[#fff] w-full block truncate px-4 text-center text-[4.5cqw]">
                {url}
              </span>
            </div>
            {/* More button */}
            <div
              className="text-[#fff]/80 bg-[rgba(15,15,15,0.32)] backdrop-blur-sm rounded-full flex items-center justify-center w-[12cqw] h-[12cqw]"
              style={{ boxShadow: buttonShadow }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 8C4 8.82843 3.32843 9.5 2.5 9.5C1.67157 9.5 1 8.82843 1 8C1 7.17157 1.67157 6.5 2.5 6.5C3.32843 6.5 4 7.17157 4 8ZM9.5 8C9.5 8.82843 8.82843 9.5 8 9.5C7.17157 9.5 6.5 8.82843 6.5 8C6.5 7.17157 7.17157 6.5 8 6.5C8.82843 6.5 9.5 7.17157 9.5 8ZM13.5 9.5C14.3284 9.5 15 8.82843 15 8C15 7.17157 14.3284 6.5 13.5 6.5C12.6716 6.5 12 7.17157 12 8C12 8.82843 12.6716 9.5 13.5 9.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          {/* Side buttons */}
          <div className="absolute top-[15%] -left-1 w-0.5 h-[3.5%] rounded-tl-full rounded-bl-full bg-[#333]" />
          <div className="absolute top-[23.4%] -left-1 w-0.5 h-[7.1%] rounded-tl-full rounded-bl-full bg-[#333]" />
          <div className="absolute top-[32.4%] -left-1 w-0.5 h-[7.1%] rounded-tl-full rounded-bl-full bg-[#333]" />
          <div className="absolute top-[28.2%] -right-1 w-0.5 h-[11%] rounded-tr-full rounded-br-full bg-[#333]" />
        </div>
      </div>
    );
  },
);

Phone.displayName = "Phone";

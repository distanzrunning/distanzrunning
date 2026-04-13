"use client";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 20, className = "" }: SpinnerProps) {
  const isSmall = size <= 16;
  const barCount = isSmall ? 8 : 12;
  const step = isSmall ? 45 : 30;
  const duration = isSmall ? 1000 : 1200;

  return (
    <div
      className={className}
      style={{ height: size, width: size }}
      role="status"
      aria-label="Loading"
    >
      <div
        className="relative left-1/2 top-1/2"
        style={{ height: size, width: size, color: "var(--ds-gray-700)" }}
      >
        {Array.from({ length: barCount }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: "-10%",
              top: "-3.9%",
              height: isSmall ? "1.5px" : "8%",
              width: isSmall ? "3px" : "24%",
              background: "currentColor",
              animation: `spinner-fade ${duration}ms linear infinite`,
              animationDelay: `${-duration + (i * duration) / barCount}ms`,
              transform: `rotate(${i * step}deg) translate(146%)`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes spinner-fade {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}

export default Spinner;

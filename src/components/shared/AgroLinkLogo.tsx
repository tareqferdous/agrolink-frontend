import { useId } from "react";

type AgroLinkLogoProps = {
  variant?: "light" | "dark";
  className?: string;
};

export default function AgroLinkLogo({
  variant = "light",
  className,
}: AgroLinkLogoProps) {
  const gradientId = useId().replace(/:/g, "");
  const agroTextColor = variant === "dark" ? "#E5E7EB" : "#1F2937";
  const iconBase = variant === "dark" ? "#22C55E" : "#166534";
  const iconInner = "#ECFDF5";
  const connector = variant === "dark" ? "#E2E8F0" : "#334155";

  return (
    <svg
      viewBox='0 0 292 56'
      role='img'
      aria-label='AgroLink logo'
      className={`h-9 w-auto ${className ?? ""}`}
      xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <linearGradient id={gradientId} x1='0%' y1='0%' x2='100%' y2='0%'>
          <stop offset='0%' stopColor='#166534' />
          <stop offset='100%' stopColor='#22C55E' />
        </linearGradient>
      </defs>

      <g transform='translate(2 8)'>
        <path
          d='M22 2C13.2 5.4 7 13.8 7 23C7 32.4 13.6 40.4 22 44C30.4 40.4 37 32.4 37 23C37 13.8 30.8 5.4 22 2Z'
          fill={iconBase}
        />
        <path
          d='M22 11V35'
          fill='none'
          stroke={iconInner}
          strokeWidth='2.4'
          strokeLinecap='round'
        />
        <path
          d='M15 24.2H19.8M24.2 24.2H29'
          fill='none'
          stroke={iconInner}
          strokeWidth='2.4'
          strokeLinecap='round'
        />
        <path
          d='M19.4 20.4C17.2 20.4 15.4 22.2 15.4 24.4C15.4 26.6 17.2 28.4 19.4 28.4H23.2V24.4H20'
          fill='none'
          stroke={iconInner}
          strokeWidth='2.4'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M24.6 20.4H28.2C30.4 20.4 32.2 22.2 32.2 24.4C32.2 26.6 30.4 28.4 28.2 28.4C26.4 28.4 24.6 28.4 24.6 28.4'
          fill='none'
          stroke={iconInner}
          strokeWidth='2.4'
          strokeLinecap='round'
          strokeLinejoin='round'
        />

        <path
          d='M31.2 10L39.6 6.8'
          fill='none'
          stroke={connector}
          strokeWidth='1.8'
          strokeLinecap='round'
        />
        <circle cx='40.4' cy='6.6' r='2.2' fill={connector} />
      </g>

      <text
        x='58'
        y='35'
        fontFamily='Sora, Inter, system-ui, sans-serif'
        fontSize='30'
        fontWeight='700'
        letterSpacing='0.15'>
        <tspan fill={agroTextColor}>Agro</tspan>
        <tspan fill={`url(#${gradientId})`}>Link</tspan>
      </text>
    </svg>
  );
}

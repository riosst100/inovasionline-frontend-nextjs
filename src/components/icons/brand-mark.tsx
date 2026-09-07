import type { SVGProps } from "react";

let gradientId = 0;

export function BrandMark(props: SVGProps<SVGSVGElement>) {
  const id = `brand-mark-gradient-${gradientId++}`;

  return (
    <svg viewBox="0 0 200 200" {...props}>
      <path
        d="M64 82 C 64 58 80 42 100 42 C 120 42 136 58 136 82"
        fill="none"
        stroke="#0D9488"
        strokeWidth={9}
        strokeLinecap="round"
      />
      <circle cx={64} cy={82} r={10} fill="#8843DB" />
      <circle cx={136} cy={82} r={10} fill="#FA6E1D" />
      <path d="M46 88 L100 88 L100 182 L74 182 C 66 182 59 176 58 168 Z" fill="#0D9488" />
      <path
        d="M154 88 L100 88 L100 182 L126 182 C 134 182 141 176 142 168 Z"
        fill={`url(#${id})`}
      />
      <rect x={94} y={88} width={12} height={90} rx={6} fill="#FBF9F6" />
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8843DB" />
          <stop offset="100%" stopColor="#FA6E1D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

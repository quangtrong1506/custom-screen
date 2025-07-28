'use client';

interface CircleProgressInterface {
   percentage: number; // từ 0 đến 100
   size?: number; // đường kính, mặc định 100
   strokeWidth?: number; // độ dày nét
   color?: string; // màu vòng tiến độ
   bgColor?: string; // màu nền vòng
}

/**
 * Hiển thị vòng tròn tiến độ.
 * @param percentage - phần trăm từ 0 đến 100
 * @param size - đường kính vòng tròn, mặc định 100
 * @param strokeWidth - độ dày nét, mặc định 10
 * @param color - màu vòng tròn, mặc định "#00cc88"
 * @param bgColor - màu nền vòng tròn, mặc định "#e6e6e6"
 * @returns Vòng tròn tiến độ
 */

export function CircleProgress({
   percentage,
   size = 100,
   strokeWidth = 10,
   color = '#00cc88',
   bgColor = '#e6e6e6',
}: CircleProgressInterface) {
   const radius = (size - strokeWidth) / 2;
   const circumference = 2 * Math.PI * radius;
   const offset = circumference - (percentage / 100) * circumference;

   return (
      <svg width={size} height={size}>
         {/* Nền vòng tròn */}
         <circle cx={size / 2} cy={size / 2} r={radius} stroke={bgColor} strokeWidth={strokeWidth} fill="none" />
         {/* Vòng tiến độ */}
         <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
         />
         {/* Text % ở giữa */}
         <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize={size * 0.2}
            fill="#333"
            fontWeight="bold"
         >
            {Math.round(percentage)}%
         </text>
      </svg>
   );
}

"use client";

import { getScoreColor } from "@/lib/trust-score-utils";

/**
 * SVG Sparkline — lightweight inline trend chart
 */
export function Sparkline({
  data,
  width = 80,
  height = 28,
  strokeWidth = 1.5,
  className = "",
}: {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  className?: string;
}) {
  if (data.length < 2) return null;

  const padding = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const latestScore = data[data.length - 1];
  const strokeColor = getScoreColor(latestScore);

  // Fill area under the line
  const areaD = `${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      <path d={areaD} fill={strokeColor} fillOpacity={0.1} />
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dot on latest point */}
      <circle
        cx={padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2)}
        cy={height - padding - ((latestScore - min) / range) * (height - padding * 2)}
        r={2}
        fill={strokeColor}
      />
    </svg>
  );
}

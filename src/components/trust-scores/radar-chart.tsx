/**
 * Radar Chart — SVG-based radar/spider chart for trust score visualization
 */

interface RadarDimension {
  label: string;
  value: number; // 0-100
}

export function RadarChart({
  dimensions,
  size = 280,
  className = "",
}: {
  dimensions: RadarDimension[];
  size?: number;
  className?: string;
}) {
  const center = size / 2;
  const radius = size / 2 - 40; // leave room for labels
  const levels = 5; // concentric pentagon levels

  const angleStep = (Math.PI * 2) / dimensions.length;
  const startAngle = -Math.PI / 2; // start from top

  // Get point coordinates for a given dimension index and value
  function getPoint(index: number, value: number) {
    const angle = startAngle + index * angleStep;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  }

  // Grid lines (concentric polygons)
  const gridPaths = [];
  for (let level = 1; level <= levels; level++) {
    const levelRadius = (level / levels) * radius;
    const points = dimensions.map((_, i) => {
      const angle = startAngle + i * angleStep;
      return {
        x: center + levelRadius * Math.cos(angle),
        y: center + levelRadius * Math.sin(angle),
      };
    });
    gridPaths.push(
      `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")} Z`,
    );
  }

  // Axis lines
  const axisLines = dimensions.map((_, i) => {
    const angle = startAngle + i * angleStep;
    return {
      x1: center,
      y1: center,
      x2: center + radius * Math.cos(angle),
      y2: center + radius * Math.sin(angle),
    };
  });

  // Data polygon
  const dataPoints = dimensions.map((dim, i) => getPoint(i, dim.value));
  const dataPath = `M ${dataPoints.map((p) => `${p.x},${p.y}`).join(" L ")} Z`;

  // Labels
  const labelPositions = dimensions.map((dim, i) => {
    const angle = startAngle + i * angleStep;
    const labelRadius = radius + 20;
    return {
      label: dim.label,
      value: dim.value,
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
      anchor: Math.cos(angle) > 0.1 ? "start" as const : Math.cos(angle) < -0.1 ? "end" as const : "middle" as const,
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      {/* Grid */}
      {gridPaths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.1}
          strokeWidth={1}
        />
      ))}

      {/* Axes */}
      {axisLines.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="currentColor"
          strokeOpacity={0.1}
          strokeWidth={1}
        />
      ))}

      {/* Data area */}
      <path
        d={dataPath}
        fill="hsl(var(--primary))"
        fillOpacity={0.15}
        stroke="hsl(var(--primary))"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill="hsl(var(--primary))" />
      ))}

      {/* Labels */}
      {labelPositions.map((pos, i) => (
        <g key={i}>
          <text
            x={pos.x}
            y={pos.y - 6}
            textAnchor={pos.anchor}
            className="fill-current text-xs font-medium"
          >
            {pos.label}
          </text>
          <text
            x={pos.x}
            y={pos.y + 8}
            textAnchor={pos.anchor}
            className="fill-muted-foreground text-xs tabular-nums"
          >
            {pos.value}
          </text>
        </g>
      ))}
    </svg>
  );
}

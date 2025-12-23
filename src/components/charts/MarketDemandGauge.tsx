import React, { useEffect, useState } from "react";

type MarketDemandGaugeProps = {
  value: number;
};

const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
  const rad = (angle * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const describeArc = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) => {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
};

const MarketDemandGauge: React.FC<MarketDemandGaugeProps> = ({ value }) => {
  const clampedValue = Math.max(0, Math.min(100, value));
  const targetAngle = (clampedValue / 100) * 180 - 90;

  const [angle, setAngle] = useState(-90);

  // Animate needle sweep
  useEffect(() => {
    requestAnimationFrame(() => setAngle(targetAngle));
  }, [targetAngle]);

  const getColor = () => {
    if (clampedValue < 40) return "#f4b400"; // yellow
    if (clampedValue < 65) return "#34a853"; // green
    return "#ea4335"; // red
  };

  const needleColor = getColor();

  // Tick marks
  const ticks = Array.from({ length: 11 });
  const cx = 100;
  const cy = 100;
  const r = 70;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 320,
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <svg viewBox="0 0 200 120" width="100%">
        {/* Gauge arcs */}
        {/* Yellow: -180° → -120° */}
        <path
          d={describeArc(cx, cy, r, -180, -120)}
          stroke="#F5A900"
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
        />

        {/* Green: -120° → -60° */}
        <path
          d={describeArc(cx, cy, r, -120, -60)}
          stroke="#34a853"
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
        />

        {/* Red: -60° → 0° */}
        <path
          d={describeArc(cx, cy, r, -60, 0)}
          stroke="#ea4335"
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
        />

        {/* Tick marks */}
        {ticks.map((_, i) => {
          const tickAngle = -180 + i * 18;
          const r1 = 58;
          const x1 = 100 + r1 * Math.cos((tickAngle * Math.PI) / 180);
          const y1 = 100 + r1 * Math.sin((tickAngle * Math.PI) / 180);

          return <circle key={i} cx={x1} cy={y1} r={1.5} fill="#aaa" />;
        })}

        {/* Needle */}
        {/* <line
          x1={100}
          y1={100}
          x2={100}
          y2={42}
          stroke={needleColor}
          strokeWidth={4}
          style={{
            transformOrigin: "100px 100px",
            transform: `rotate(${angle}deg)`,
            transition: "transform 1s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        /> */}
        <path
          d="M96 100 L104 100 L101 52 L99 52 Z"
          fill={needleColor}
          style={{
            transformOrigin: "100px 100px",
            transform: `rotate(${angle}deg)`,
            transition: "transform 1s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />

        {/* Center circles */}
        <circle cx={100} cy={100} r={8} fill={needleColor} />
      </svg>
    </div>
  );
};

export default MarketDemandGauge;

import React from 'react';

interface ProgressRingProps {
  value: number; // 0–100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 80,
  strokeWidth = 7,
  color = '#009688',
  trackColor = '#e0f2f1',
  label,
  sublabel,
}) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, Math.max(0, value)) / 100) * circ;
  const cx = size / 2;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      {label && (
        <div className="text-center -mt-1">
          <p className="text-sm font-bold text-gray-800">{label}</p>
          {sublabel && <p className="text-xs text-neutral-400">{sublabel}</p>}
        </div>
      )}
    </div>
  );
};

export default ProgressRing;

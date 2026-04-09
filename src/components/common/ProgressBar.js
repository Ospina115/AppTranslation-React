import React from 'react';

export default function ProgressBar({
  progress = 0,
  height = 10,
  color,
  backgroundColor,
  showLabel = false,
  label,
  style,
}) {
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div className="progress-bar-wrapper" style={style}>
      {showLabel && (
        <div className="progress-label">
          <span>{label || `${clamped}%`}</span>
        </div>
      )}
      <div
        className="progress-track"
        style={{ height, backgroundColor: backgroundColor || undefined }}
      >
        <div
          className="progress-fill"
          style={{
            width: `${clamped}%`,
            height,
            backgroundColor: color || undefined,
          }}
        />
      </div>
    </div>
  );
}

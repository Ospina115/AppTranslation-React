import React from 'react';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  className = '',
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      onClick={onPress}
      disabled={disabled || loading}
      style={style}
    >
      {loading ? (
        <span className="spinner" />
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {title}
        </>
      )}
    </button>
  );
}

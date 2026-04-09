import React from 'react';

export default function Card({
  children,
  style,
  variant = 'default',
  padding = true,
  className = '',
}) {
  const classes = [
    variant === 'outlined' ? 'card-outlined' : 'card',
    !padding && 'card-no-padding',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
}

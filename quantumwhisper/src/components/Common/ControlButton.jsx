import React from 'react';

function clsx(...arr) {
  return arr.filter(Boolean).join(' ');
}

const ControlButton = ({
  children,
  onClick,
  loading = false,
  disabled = false,
  variant = 'primary',
  className = '',
  ...rest
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        'modern-btn',
        variant === 'primary' && 'modern-btn-primary',
        variant === 'secondary' && 'modern-btn-secondary',
        variant === 'outline' && 'modern-btn-outline',
        loading && 'modern-btn-loading',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default ControlButton;
import React from 'react';

/**
 * Generic button component.
 * @param {'primary'|'secondary'|'ghost'|'danger'} variant
 */
function Button({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  title,
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`btn btn-${variant}${className ? ` ${className}` : ''}`}
    >
      {children}
    </button>
  );
}

export default Button;

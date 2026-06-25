import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  label: string;
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  label,
  style,
  ...props
}: ButtonProps) => {
  // Estilos base (puros, sin depender de librerías externas por ahora)
  const baseStyles: React.CSSProperties = {
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s ease-in-out',
    fontFamily: 'Inter, system-ui, sans-serif',
  };

  // Variantes de color institucionales
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: '#003366', color: '#FFFFFF' },
    danger: { backgroundColor: '#D32F2F', color: '#FFFFFF' },
    outline: {
      backgroundColor: 'transparent',
      color: '#003366',
      border: '2px solid #003366',
    },
  };

  // Tamaños
  const sizeStyles: Record<string, React.CSSProperties> = {
    small: { padding: '8px 16px', fontSize: '14px' },
    medium: { padding: '12px 24px', fontSize: '16px' },
    large: { padding: '16px 32px', fontSize: '18px' },
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {label}
    </button>
  );
};

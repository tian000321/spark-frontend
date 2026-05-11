'use client';
import React from 'react';

interface SparkButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function SparkButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  fullWidth = false,
}: SparkButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    border: 'none',
    borderRadius: 'var(--spark-radius-md)',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'var(--spark-transition)',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'var(--spark-font-family)',
    whiteSpace: 'nowrap',
    ...getSizeStyle(size),
    ...getVariantStyle(variant),
  };

  return (
    <button style={baseStyle} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function getSizeStyle(size: string): React.CSSProperties {
  switch (size) {
    case 'sm':
      return { padding: '6px 14px', fontSize: 'var(--spark-font-size-sm)' };
    case 'lg':
      return { padding: '14px 28px', fontSize: 'var(--spark-font-size-lg)' };
    default:
      return { padding: '10px 22px', fontSize: 'var(--spark-font-size-md)' };
  }
}

function getVariantStyle(variant: string): React.CSSProperties {
  switch (variant) {
    case 'secondary':
      return {
        background: 'rgba(255, 255, 255, 0.08)',
        color: 'var(--spark-text-primary)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
      };
    case 'danger':
      return {
        background: 'var(--spark-danger)',
        color: '#fff',
      };
    case 'ghost':
      return {
        background: 'transparent',
        color: 'var(--spark-text-secondary)',
      };
    default:
      return {
        background: 'var(--spark-brand-gradient)',
        color: '#fff',
      };
  }
}
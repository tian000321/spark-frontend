import React from 'react';

interface SparkBadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
}

const variantMap: Record<string, React.CSSProperties> = {
  success: { background: 'var(--spark-success-bg)', color: 'var(--spark-success)' },
  warning: { background: 'var(--spark-warning-bg)', color: 'var(--spark-warning)' },
  danger: { background: 'var(--spark-danger-bg)', color: 'var(--spark-danger)' },
  info: { background: 'rgba(108, 92, 231, 0.12)', color: 'var(--spark-brand-light)' },
  default: { background: 'rgba(255, 255, 255, 0.06)', color: 'var(--spark-text-secondary)' },
};

export default function SparkBadge({ children, variant = 'default' }: SparkBadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: 'var(--spark-radius-full)',
        fontSize: 'var(--spark-font-size-xs)',
        fontWeight: 500,
        ...variantMap[variant],
      }}
    >
      {children}
    </span>
  );
}
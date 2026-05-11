import React from 'react';

interface SparkCardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  onClick?: () => void;
  padding?: string | number;
  style?: React.CSSProperties;
}

export default function SparkCard({
  children,
  hoverable = false,
  onClick,
  padding = 24,
  style,
}: SparkCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--spark-bg-card)',
        borderRadius: 'var(--spark-radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(12px)',
        padding,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'var(--spark-transition)',
        ...(hoverable && {
          background: 'var(--spark-bg-card)',
          boxShadow: 'var(--spark-shadow-sm)',
        }),
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.background = 'var(--spark-bg-card-hover)';
          e.currentTarget.style.boxShadow = 'var(--spark-shadow-md)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.background = 'var(--spark-bg-card)';
          e.currentTarget.style.boxShadow = 'var(--spark-shadow-sm)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {children}
    </div>
  );
}
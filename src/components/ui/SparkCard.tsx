'use client';
import React from 'react';

interface SparkCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: string | number;
  style?: React.CSSProperties;
}

export default function SparkCard({ children, onClick, hoverable = false, padding = 24, style }: SparkCardProps) {
  return (
    <div
      onClick={onClick}
      className={hoverable ? 'spark-card-hoverable' : undefined}
      style={{
        background: 'var(--spark-bg-card)',
        borderRadius: 'var(--spark-radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(12px)',
        padding,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'var(--spark-transition)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
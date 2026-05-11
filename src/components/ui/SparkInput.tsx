'use client';
import React from 'react';

interface SparkInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  style?: React.CSSProperties;
}

export default function SparkInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  style,
}: SparkInputProps) {
  return (
    <div style={{ width: '100%' }}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: `1.5px solid ${error ? 'var(--spark-danger)' : 'rgba(255, 255, 255, 0.12)'}`,
          borderRadius: 'var(--spark-radius-md)',
          background: 'var(--spark-bg-input)',
          color: 'var(--spark-text-primary)',
          fontSize: 'var(--spark-font-size-md)',
          fontFamily: 'var(--spark-font-family)',
          outline: 'none',
          transition: 'var(--spark-transition)',
          ...style,
        }}
      />
      {error && (
        <p style={{ color: 'var(--spark-danger)', fontSize: 'var(--spark-font-size-xs)', marginTop: 6 }}>
          {error}
        </p>
      )}
    </div>
  );
}
'use client';
import React from 'react';

interface SparkModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function SparkModal({ isOpen, onClose, title, children }: SparkModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--spark-bg-secondary)',
          borderRadius: 'var(--spark-radius-lg)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: 28,
          width: '90%',
          maxWidth: 420,
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: 'var(--spark-shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: 'var(--spark-font-size-xl)', fontWeight: 700 }}>{title}</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--spark-text-secondary)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
'use client';
import React from 'react';

interface Column {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: any, record: any, index: number) => React.ReactNode;
  width?: string;
}

interface SparkTableProps {
  columns: Column[];
  data: any[];
  rowKey?: string;
  onRowClick?: (record: any) => void;
  emptyText?: string;
}

export default function SparkTable({
  columns,
  data,
  rowKey = 'id',
  onRowClick,
  emptyText = '暂无数据',
}: SparkTableProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 'var(--spark-font-size-sm)',
      }}>
        <thead>
          <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.08)', textAlign: 'left' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: '12px 16px',
                  fontWeight: 600,
                  color: 'var(--spark-text-secondary)',
                  width: col.width,
                  whiteSpace: 'nowrap',
                }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  textAlign: 'center',
                  padding: 40,
                  color: 'var(--spark-text-muted)',
                }}
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((record, index) => (
              <tr
                key={record[rowKey] || index}
                onClick={() => onRowClick?.(record)}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (onRowClick) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: '12px 16px',
                      color: 'var(--spark-text-primary)',
                    }}
                  >
                    {col.render
                      ? col.render(record[col.dataIndex || col.key], record, index)
                      : record[col.dataIndex || col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
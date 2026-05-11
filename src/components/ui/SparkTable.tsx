import React from 'react';

interface Column {
  key: string;
  title: string;
  render?: (value: any, record: any) => React.ReactNode;
  width?: string;
}

interface SparkTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (record: any) => void;
}

export default function SparkTable({ columns, data, onRowClick }: SparkTableProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--spark-font-size-sm)' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.08)', textAlign: 'left' }}>
            {columns.map((col) => (
              <th key={col.key} style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--spark-text-secondary)', width: col.width }}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((record, i) => (
            <tr
              key={record.id || i}
              onClick={() => onRowClick?.(record)}
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'var(--spark-transition)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '12px 16px' }}>
                  {col.render ? col.render(record[col.key], record) : record[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
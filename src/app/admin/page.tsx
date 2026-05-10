'use client';
import AuthGuard from '@/components/AuthGuard';
import { useState, useEffect } from 'react';
import DeviceStatusCard from '@/components/DeviceStatusCard';
import VetoEventLog from '@/components/VetoEventLog';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'applications' | 'trust'>('applications');
  const [applications, setApplications] = useState<any[]>([]);

  // 加载入驻申请
  const loadApplications = () => {
    const roles = [
      { key: 'creator_status', role: '创作' },
      { key: 'developer_status', role: '开发' },
      { key: 'provider_status', role: '节点' },
      { key: 'agent_status', role: '代理' },
    ];

    const apps: any[] = [];
    roles.forEach(({ key, role }) => {
      const status = localStorage.getItem(key);
      if (status === 'pending') {
        const name = localStorage.getItem(key + '_name') || '未知';
        const phone = localStorage.getItem(key + '_phone') || '未知';
        const detail = localStorage.getItem(key + '_detail') || '';
        const time = localStorage.getItem(key + '_time') || new Date().toLocaleString();
        apps.push({ id: key, role, name, phone, detail, time, status: 'pending', storageKey: key });
      }
    });
    setApplications(apps);
  };

  useEffect(() => { loadApplications(); }, []);

  const approve = (storageKey: string, role: string) => {
    localStorage.setItem(storageKey, 'approved');
    alert(`${role} 申请已通过`);
    loadApplications();
  };

  const reject = (storageKey: string, role: string) => {
    localStorage.setItem(storageKey, 'none');
    alert(`${role} 申请已驳回`);
    loadApplications();
  };

  return (
    <>
      <AuthGuard />
      <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24 }}>⚙️ 管理后台</h1>

        {/* 标签页切换 */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('applications')}
            style={{
              padding: '10px 24px', border: 'none', background: 'transparent',
              borderBottom: activeTab === 'applications' ? '2px solid var(--btn-primary-bg)' : '2px solid transparent',
              color: activeTab === 'applications' ? 'var(--btn-primary-bg)' : 'var(--text-muted)',
              fontWeight: activeTab === 'applications' ? 'bold' : 'normal', cursor: 'pointer', marginBottom: -2,
            }}
          >
            📋 入驻审核
          </button>
          <button
            onClick={() => setActiveTab('trust')}
            style={{
              padding: '10px 24px', border: 'none', background: 'transparent',
              borderBottom: activeTab === 'trust' ? '2px solid var(--btn-primary-bg)' : '2px solid transparent',
              color: activeTab === 'trust' ? 'var(--btn-primary-bg)' : 'var(--text-muted)',
              fontWeight: activeTab === 'trust' ? 'bold' : 'normal', cursor: 'pointer', marginBottom: -2,
            }}
          >
            🛡️ 信任仪表盘
          </button>
        </div>

        {/* 入驻审核 */}
        {activeTab === 'applications' && (
          <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
            <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>📋 入驻申请审核</h2>
            {applications.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 40 }}>暂无待审核申请</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                      <th style={{ padding: '10px 8px' }}>角色</th>
                      <th style={{ padding: '10px 8px' }}>姓名/企业</th>
                      <th style={{ padding: '10px 8px' }}>联系电话</th>
                      <th style={{ padding: '10px 8px' }}>详细信息</th>
                      <th style={{ padding: '10px 8px' }}>申请时间</th>
                      <th style={{ padding: '10px 8px' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '10px 8px', fontWeight: 500 }}>{app.role}</td>
                        <td style={{ padding: '10px 8px' }}>{app.name}</td>
                        <td style={{ padding: '10px 8px' }}>{app.phone}</td>
                        <td style={{ padding: '10px 8px', color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={app.detail}>
                          {app.detail || '-'}
                        </td>
                        <td style={{ padding: '10px 8px', fontSize: 12, color: 'var(--text-muted)' }}>{app.time}</td>
                        <td style={{ padding: '10px 8px', display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => approve(app.storageKey, app.role)}
                            style={{ padding: '6px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold', fontSize: 13 }}
                          >
                            通过
                          </button>
                          <button
                            onClick={() => reject(app.storageKey, app.role)}
                            style={{ padding: '6px 16px', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold', fontSize: 13 }}
                          >
                            驳回
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 信任仪表盘（原 /trust 页面内容） */}
        {activeTab === 'trust' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <DeviceStatusCard />
            <VetoEventLog />
            {/* 原有的调度统计卡片也可以保留在此处，为简洁起见我们只放了组件 */}
          </div>
        )}
      </div>
    </>
  );
}
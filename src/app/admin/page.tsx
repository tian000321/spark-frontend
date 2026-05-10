'use client';
import { useState, useEffect } from 'react';

// 定义申请数据类型
interface Application {
  id: string;
  role: string;
  name: string;
  phone: string;
  detail: string;
  time: string;
  status: string;
  storageKey: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'applications' | 'other'>('applications');
  const [applications, setApplications] = useState<Application[]>([]);

  // 读取所有待审核和已审核的申请
  const loadApplications = () => {
    const roles = [
      { key: 'creator_status', role: '创作者', storageKey: 'creator_status' },
      { key: 'developer_status', role: '开发者', storageKey: 'developer_status' },
      { key: 'provider_status', role: '节点提供者', storageKey: 'provider_status' },
      { key: 'agent_status', role: '代理商', storageKey: 'agent_status' },
    ];

    const apps: Application[] = [];

    roles.forEach(({ key, role, storageKey }) => {
      const status = localStorage.getItem(key);
      if (status === 'pending') {
        // 读取对应角色的申请表单数据（简化：只取姓名和电话）
        const name = localStorage.getItem(`${key}_name`) || '未知';
        const phone = localStorage.getItem(`${key}_phone`) || '未知';
        const detail = localStorage.getItem(`${key}_detail`) || '';
        const time = localStorage.getItem(`${key}_time`) || new Date().toLocaleString();
        apps.push({
          id: `${role}-${Date.now()}`,
          role,
          name,
          phone,
          detail,
          time,
          status: 'pending',
          storageKey,
        });
      }
    });

    // 也可以读取已审核通过的（可选）
    setApplications(apps);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // 通过申请：将状态改为 approved
  const approve = (storageKey: string, role: string) => {
    localStorage.setItem(storageKey, 'approved');
    alert(`${role} 申请已通过，用户可进入签约流程。`);
    loadApplications();
  };

  // 驳回申请：将状态改为 none，并可选择清除数据
  const reject = (storageKey: string, role: string) => {
    localStorage.setItem(storageKey, 'none');
    alert(`${role} 申请已驳回。`);
    loadApplications();
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24 }}>⚙️ 管理后台</h1>
      
      {/* 标签页切换 */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '2px solid var(--border-color)' }}>
        <button
          onClick={() => setActiveTab('applications')}
          style={{
            padding: '10px 24px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'applications' ? '2px solid var(--btn-primary-bg)' : '2px solid transparent',
            color: activeTab === 'applications' ? 'var(--btn-primary-bg)' : 'var(--text-muted)',
            fontWeight: activeTab === 'applications' ? 'bold' : 'normal',
            cursor: 'pointer',
            marginBottom: -2,
          }}
        >
          📋 入驻审核
        </button>
        <button
          onClick={() => setActiveTab('other')}
          style={{
            padding: '10px 24px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'other' ? '2px solid var(--btn-primary-bg)' : '2px solid transparent',
            color: activeTab === 'other' ? 'var(--btn-primary-bg)' : 'var(--text-muted)',
            fontWeight: activeTab === 'other' ? 'bold' : 'normal',
            cursor: 'pointer',
            marginBottom: -2,
          }}
        >
          其他管理
        </button>
      </div>

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
                          style={{
                            padding: '6px 16px',
                            background: 'var(--btn-success-bg)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: 13,
                          }}
                        >
                          通过
                        </button>
                        <button
                          onClick={() => reject(app.storageKey, app.role)}
                          style={{
                            padding: '6px 16px',
                            background: '#e53e3e',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: 13,
                          }}
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

      {activeTab === 'other' && (
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12 }}>
          <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>其他管理功能</h2>
          <p style={{ color: 'var(--text-muted)' }}>后续版本将开放用户管理、伦理表决、影子审批等功能。</p>
        </div>
      )}
    </div>
  );
}
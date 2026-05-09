'use client';
import { useState, useEffect } from 'react';

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [showSign, setShowSign] = useState(false);
  const [signType, setSignType] = useState('节点提供者');
  const [signDetails, setSignDetails] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/v1/contracts')
      .then(r => r.json())
      .then(setContracts)
      .catch(() => setContracts([]));
  }, []);

  const handleSign = () => {
    fetch('http://localhost:8080/v1/contracts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: signType, details: signDetails }),
    })
      .then(r => r.json())
      .then(newCtr => {
        setContracts(prev => [...prev, newCtr]);
        setShowSign(false);
        setSignDetails('');
        alert('合约签署成功！');
      })
      .catch(() => alert('签署失败'));
  };

  const renewContract = (id: string) => {
    fetch(`http://localhost:8080/v1/contracts/${id}/renew`, { method: 'POST' })
      .then(r => r.json())
      .then(updated => {
        setContracts(prev => prev.map(c => c.id === id ? updated : c));
        alert('续费成功，合约已延长一年');
      });
  };

  const terminateContract = (id: string) => {
    if (!confirm('确定要终止此合约吗？')) return;
    fetch(`http://localhost:8080/v1/contracts/${id}/terminate`, { method: 'POST' })
      .then(r => r.json())
      .then(updated => {
        setContracts(prev => prev.map(c => c.id === id ? updated : c));
        alert('合约已终止');
      });
  };

  const getStatusStyle = (status: string) => {
    if (status === '生效中') return { background: 'var(--badge-green-bg)', color: 'var(--badge-green-text)' };
    if (status === '即将到期') return { background: 'var(--badge-orange-bg)', color: 'var(--badge-orange-text)' };
    return { background: 'var(--badge-red-bg)', color: 'var(--badge-red-text)' };
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: '1px solid var(--input-border)', borderRadius: 8,
    fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)', boxSizing: 'border-box',
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)' }}>📜 我的合约</h1>
        <button onClick={() => setShowSign(true)} style={{ padding: '10px 20px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>
          + 签署新合约
        </button>
      </div>

      {contracts.map(ctr => (
        <div key={ctr.id} style={{ background: 'var(--bg-card)', padding: 16, borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <p style={{ fontWeight: 600 }}>{ctr.type} · {ctr.id}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {ctr.startDate?.slice(0, 10)} ~ {ctr.endDate?.slice(0, 10)} · 年费 ¥{ctr.fee}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ctr.details}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ ...getStatusStyle(ctr.status), padding: '3px 10px', borderRadius: 10, fontSize: 12 }}>{ctr.status}</span>
              {ctr.status === '生效中' && (
                <>
                  <button onClick={() => renewContract(ctr.id)} style={{ padding: '4px 10px', background: 'var(--btn-success-bg)', color: '#fff', border: 'none', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>续费</button>
                  <button onClick={() => terminateContract(ctr.id)} style={{ padding: '4px 10px', background: 'var(--badge-red-bg)', color: 'var(--badge-red-text)', border: 'none', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>终止</button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {contracts.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>暂无合约，请签署新合约</p>}

      {/* 签署弹窗 */}
      {showSign && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'var(--bg-card)', padding: 30, borderRadius: 12, width: '90%', maxWidth: 450 }}>
            <h3 style={{ marginBottom: 16 }}>📝 签署新合约</h3>
            <label style={{ fontSize: 13, marginBottom: 4, display: 'block' }}>合约类型</label>
            <select value={signType} onChange={e => setSignType(e.target.value)} style={{ ...inputStyle, marginBottom: 12 }}>
              <option>节点提供者</option>
              <option>市级代理 (¥10,000/年)</option>
              <option>县区代理 (¥1,000/年)</option>
              <option>智能体代理 (¥1,000/个/年)</option>
              <option>开发者入驻</option>
            </select>
            <label style={{ fontSize: 13, marginBottom: 4, display: 'block' }}>补充说明</label>
            <input value={signDetails} onChange={e => setSignDetails(e.target.value)} placeholder="如覆盖区域、智能体名称等" style={{ ...inputStyle, marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowSign(false)} style={{ padding: '8px 16px', border: '1px solid var(--input-border)', borderRadius: 6, background: 'var(--input-bg)' }}>取消</button>
              <button onClick={handleSign} style={{ padding: '8px 16px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6 }}>确认签署</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
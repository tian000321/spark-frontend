'use client';
import { useState, useEffect } from 'react';

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [showRecharge, setShowRecharge] = useState(false);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/v1/revenue/summary')
      .then(r => r.json())
      .then(data => setBalance(data.balance || 0))
      .catch(() => setBalance(0));
  }, []);

  const handleRecharge = async () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) { alert('请输入有效金额'); return; }
    try {
      await fetch('http://localhost:8080/v1/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: val }),
      });
      const res = await fetch('http://localhost:8080/v1/revenue/summary');
      const data = await res.json();
      setBalance(data.balance || 0);
      setAmount('');
      setShowRecharge(false);
    } catch (e) { alert('充值失败'); }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: 500, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 20 }}>👛 我的钱包</h1>
      <div style={{ background: 'var(--bg-card)', padding: 32, borderRadius: 16, border: '1px solid var(--border-color)', textAlign: 'center', marginBottom: 24 }}>
        <p style={{ color: 'var(--text-muted)' }}>可用余额</p>
        <p style={{ fontSize: 48, fontWeight: 'bold', color: 'var(--btn-primary-bg)', margin: '12px 0' }}>¥{(balance || 0).toFixed(2)}</p>
        <button onClick={() => setShowRecharge(true)} style={{ padding: '12px 32px', background: 'var(--btn-success-bg)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' }}>
          充值
        </button>
      </div>

      {showRecharge && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: 'var(--bg-card)', padding: 30, borderRadius: 12, width: '90%', maxWidth: 360 }}>
            <h3 style={{ marginBottom: 16 }}>💰 充值</h3>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="请输入金额" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)', marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowRecharge(false)} style={{ padding: '8px 16px', border: '1px solid var(--input-border)', borderRadius: 6, background: 'var(--input-bg)', color: 'var(--text-primary)' }}>取消</button>
              <button onClick={handleRecharge} style={{ padding: '8px 16px', background: 'var(--btn-success-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>确认充值</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
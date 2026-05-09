'use client';
import { useState, useEffect } from 'react';

export default function RevenuePage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const [amount, setAmount] = useState('');

  const fetchSummary = () => {
    fetch('http://localhost:8080/v1/revenue/summary')
      .then(res => res.json())
      .then(data => {
        setBalance(data.balance);
        setTransactions(data.transactions || []);
      })
      .catch(() => {});
  };

  useEffect(() => { fetchSummary(); }, []);

  const handleRecharge = async () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) { alert('请输入有效金额'); return; }
    try {
      await fetch('http://localhost:8080/v1/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: val }),
      });
      fetchSummary();
      setAmount('');
      setShowRecharge(false);
    } catch (e) { alert('充值失败'); }
  };

  const handleWithdraw = async () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) { alert('请输入有效金额'); return; }
    if (val > balance) { alert('余额不足'); return; }
    try {
      await fetch('http://localhost:8080/v1/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: val }),
      });
      fetchSummary();
      setAmount('');
      setShowWithdraw(false);
    } catch (e) { alert('提现失败'); }
  };

  const openModal = (type: 'recharge' | 'withdraw') => {
    setAmount('');
    if (type === 'recharge') { setShowRecharge(true); setShowWithdraw(false); }
    else { setShowWithdraw(true); setShowRecharge(false); }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 20 }}>收益仪表盘</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 30 }}>
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)' }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>可用余额</p>
          <p style={{ fontSize: 40, fontWeight: 'bold', color: 'var(--btn-primary-bg)', marginTop: 8 }}>¥{balance.toFixed(2)}</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>实时更新 · 毫分结算</p>
        </div>
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
          <button onClick={() => openModal('recharge')} style={{ padding: '12px 0', background: 'var(--btn-success-bg)', color: 'var(--btn-success-text)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 'bold', cursor: 'pointer' }}>充值</button>
          <button onClick={() => openModal('withdraw')} style={{ padding: '12px 0', background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 'bold', cursor: 'pointer' }}>提现</button>
        </div>
      </div>

      {(showRecharge || showWithdraw) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '0 16px' }}>
          <div style={{ background: 'var(--bg-card)', padding: 30, borderRadius: 12, width: '100%', maxWidth: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: 16 }}>{showRecharge ? '💰 充值' : '💸 提现'}</h3>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="请输入金额" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)', marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowRecharge(false); setShowWithdraw(false); }} style={{ padding: '8px 16px', border: '1px solid var(--input-border)', borderRadius: 6, background: 'var(--input-bg)', color: 'var(--text-primary)', cursor: 'pointer' }}>取消</button>
              <button onClick={showRecharge ? handleRecharge : handleWithdraw} style={{ padding: '8px 16px', background: showRecharge ? 'var(--btn-success-bg)' : 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>确认{showRecharge ? '充值' : '提现'}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow)', overflowX: 'auto' }}>
        <h2 style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 16 }}>交易记录</h2>
        <table style={{ width: '100%', minWidth: 500, borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', textAlign: 'left' }}>
              <th style={{ padding: 10, color: 'var(--text-secondary)' }}>类型</th>
              <th style={{ padding: 10, color: 'var(--text-secondary)' }}>金额</th>
              <th style={{ padding: 10, color: 'var(--text-secondary)' }}>时间</th>
              <th style={{ padding: 10, color: 'var(--text-secondary)' }}>状态</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: 10, color: 'var(--text-primary)' }}>{tx.type}</td>
                <td style={{ padding: 10, color: tx.amount.startsWith('+') ? 'var(--badge-green-text)' : 'var(--badge-red-text)' }}>{tx.amount}</td>
                <td style={{ padding: 10, color: 'var(--text-muted)' }}>{tx.time}</td>
                <td style={{ padding: 10 }}><span style={{ background: 'var(--badge-green-bg)', color: 'var(--badge-green-text)', padding: '2px 8px', borderRadius: 10, fontSize: 12 }}>{tx.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
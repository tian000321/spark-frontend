'use client';
import AuthGuard from '@/components/AuthGuard';
import PaymentPassword from '@/components/PaymentPassword';
import { useState, useEffect } from 'react';

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [frozenBalance, setFrozenBalance] = useState(0);
  const [showRecharge, setShowRecharge] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState<{ type: string; amount: number; time: string }[]>([]);
  const [showPaymentPassword, setShowPaymentPassword] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'set' | 'modify'>('set');
  const [pendingWithdraw, setPendingWithdraw] = useState<number | null>(null);

  useEffect(() => {
    setBalance(8520.00);
    setFrozenBalance(1500.00);
    setTransactions([
      { type: '充值', amount: 5000, time: '2026-05-10 14:30' },
      { type: '提现', amount: -2000, time: '2026-05-08 10:15' },
      { type: '赔付收入', amount: 200, time: '2026-05-07 03:42' },
      { type: '任务冻结', amount: -1500, time: '2026-05-09 08:00' },
    ]);
  }, []);

  const handleRecharge = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) { alert('请输入有效金额'); return; }
    setBalance(prev => prev + val);
    setTransactions(prev => [{ type: '充值', amount: val, time: new Date().toLocaleString() }, ...prev]);
    setAmount('');
    setShowRecharge(false);
  };

  const handleWithdraw = (password?: string) => {
    const val = pendingWithdraw || parseFloat(amount);
    if (!val || isNaN(val) || val <= 0) { alert('请输入有效金额'); return; }
    
    const paymentPwd = localStorage.getItem('payment_password');
    if (!paymentPwd) {
      alert('请先设置支付密码，以确保资金安全');
      setPaymentMode('set');
      setShowPaymentPassword(true);
      return;
    }

    if (val > balance) {
      alert(`余额不足！当前可用余额 ¥${balance.toFixed(2)}，无法提现 ¥${val.toFixed(2)}`);
      return;
    }

    if (!password) {
      setPendingWithdraw(val);
      setShowPaymentPassword(true);
      return;
    }

    if (password !== paymentPwd) {
      alert('支付密码错误，提现失败');
      setPendingWithdraw(null);
      return;
    }

    const withdrawAmount = pendingWithdraw || val;
    setBalance(prev => prev - withdrawAmount);
    setTransactions(prev => [{ type: '提现', amount: -withdrawAmount, time: new Date().toLocaleString() }, ...prev]);
    setAmount('');
    setShowWithdraw(false);
    setPendingWithdraw(null);
    alert('提现申请已提交，预计 1-2 个工作日到账');
  };

  const handlePaymentSuccess = () => {
    setShowPaymentPassword(false);
    if (pendingWithdraw) {
      handleWithdraw(localStorage.getItem('payment_password') || '');
    }
  };

  const openPaymentSettings = () => {
    setPaymentMode(localStorage.getItem('payment_password') ? 'modify' : 'set');
    setShowPaymentPassword(true);
  };

  return (
    <>
      <AuthGuard />
      <div style={{ padding: '40px 20px', maxWidth: 500, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 20 }}>👛 我的钱包</h1>

        {/* 余额卡片 */}
        <div style={{ background: 'var(--bg-card)', padding: 32, borderRadius: 16, border: '1px solid var(--border-color)', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>可用余额</p>
              <p style={{ fontSize: 36, fontWeight: 'bold', color: 'var(--btn-primary-bg)', margin: '8px 0' }}>¥{balance.toFixed(2)}</p>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>冻结资金</p>
              <p style={{ fontSize: 36, fontWeight: 'bold', color: '#f59e0b', margin: '8px 0' }}>¥{frozenBalance.toFixed(2)}</p>
            </div>
          </div>

          <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 16 }}>
            总资产：¥{(balance + frozenBalance).toFixed(2)} &nbsp;|&nbsp; 冻结资金为进行中任务的保证金，任务完成后自动解冻
          </p>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowRecharge(true)} style={{ flex: 1, padding: '12px 0', background: 'var(--btn-success-bg)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 'bold', cursor: 'pointer' }}>
              充值
            </button>
            <button onClick={() => setShowWithdraw(true)} style={{ flex: 1, padding: '12px 0', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 'bold', cursor: 'pointer' }}>
              提现
            </button>
          </div>
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <button onClick={openPaymentSettings} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--input-border)', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: 'var(--text-muted)' }}>
              🔐 支付密码
            </button>
          </div>
        </div>

        {/* 交易记录 */}
        <div style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>📋 资金明细</h3>
          <div style={{ fontSize: 13 }}>
            {transactions.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>暂无记录</p>}
            {transactions.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>{item.type}</span>
                <span style={{ color: item.amount >= 0 ? '#16a34a' : '#dc2626', fontWeight: 500 }}>
                  {item.amount >= 0 ? '+' : ''}¥{item.amount.toLocaleString()}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 充值弹窗 */}
        {showRecharge && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: 'var(--bg-card)', padding: 30, borderRadius: 12, width: '90%', maxWidth: 360, position: 'relative' }}>
              <button onClick={() => setShowRecharge(false)} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
              <h3 style={{ marginBottom: 16 }}>💰 充值</h3>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="请输入金额" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)', marginBottom: 16 }} />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button onClick={() => setShowRecharge(false)} style={{ padding: '8px 16px', border: '1px solid var(--input-border)', borderRadius: 6, background: 'var(--input-bg)', color: 'var(--text-primary)' }}>取消</button>
                <button onClick={handleRecharge} style={{ padding: '8px 16px', background: 'var(--btn-success-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>确认充值</button>
              </div>
            </div>
          </div>
        )}

        {/* 提现弹窗 */}
        {showWithdraw && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: 'var(--bg-card)', padding: 30, borderRadius: 12, width: '90%', maxWidth: 360, position: 'relative' }}>
              <button onClick={() => setShowWithdraw(false)} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
              <h3 style={{ marginBottom: 16 }}>💳 提现</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>可用余额：¥{balance.toFixed(2)}</p>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="请输入提现金额" style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--input-border)', borderRadius: 8, fontSize: 14, background: 'var(--input-bg)', color: 'var(--text-primary)', marginBottom: 16 }} />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button onClick={() => setShowWithdraw(false)} style={{ padding: '8px 16px', border: '1px solid var(--input-border)', borderRadius: 6, background: 'var(--input-bg)', color: 'var(--text-primary)' }}>取消</button>
                <button onClick={() => handleWithdraw()} style={{ padding: '8px 16px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>确认提现</button>
              </div>
            </div>
          </div>
        )}

        {/* 支付密码弹窗 */}
        {showPaymentPassword && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
            <div style={{ background: 'var(--bg-card)', padding: 30, borderRadius: 12, width: '90%', maxWidth: 400, position: 'relative' }}>
              <button
                onClick={() => { setShowPaymentPassword(false); setPendingWithdraw(null); }}
                style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
              <PaymentPassword
                mode={paymentMode}
                onSuccess={handlePaymentSuccess}
                onCancel={() => { setShowPaymentPassword(false); setPendingWithdraw(null); }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
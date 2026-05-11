'use client';
import { useState } from 'react';

interface PaymentPasswordProps {
  mode: 'set' | 'verify' | 'modify';
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function PaymentPassword({ mode, onSuccess, onCancel }: PaymentPasswordProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const storedPassword = typeof window !== 'undefined' ? localStorage.getItem('payment_password') : null;

  const handleSetPassword = () => {
    if (password.length < 6) {
      setError('支付密码至少 6 位数字');
      return;
    }
    if (!/^\d{6,}$/.test(password)) {
      setError('支付密码只能包含数字');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    localStorage.setItem('payment_password', password);
    localStorage.setItem('payment_password_set_at', new Date().toISOString());
    alert('支付密码设置成功！请牢记您的支付密码。');
    onSuccess();
  };

  const handleVerify = () => {
    if (password !== storedPassword) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) {
        setError('支付密码错误次数过多，请 30 分钟后重试');
        localStorage.setItem('payment_password_locked', new Date().toISOString());
        return;
      }
      setError(`支付密码错误，还剩 ${5 - newAttempts} 次机会`);
      return;
    }
    setError('');
    onSuccess();
  };

  const handleModify = () => {
    if (oldPassword !== storedPassword) {
      setError('原密码错误');
      return;
    }
    if (password.length < 6 || !/^\d{6,}$/.test(password)) {
      setError('新密码至少 6 位数字');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次输入不一致');
      return;
    }
    localStorage.setItem('payment_password', password);
    alert('支付密码修改成功！');
    onSuccess();
  };

  return (
    <div style={{ padding: 20 }}>
      {mode === 'set' && (
        <div>
          <h3 style={{ marginBottom: 16 }}>🔐 设置支付密码</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            支付密码用于提现等敏感操作，与登录密码不同。请设置 6 位以上数字密码。
          </p>
          <input
            type="password"
            placeholder="请输入支付密码（6位以上数字）"
            value={password}
            onChange={e => setPassword(e.target.value)}
            maxLength={20}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="再次输入支付密码"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            maxLength={20}
            style={{ ...inputStyle, marginTop: 10 }}
          />
          {error && <p style={{ color: '#dc2626', fontSize: 13, marginTop: 8 }}>{error}</p>}
          <button onClick={handleSetPassword} style={{ marginTop: 16, padding: '10px 24px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>
            确认设置
          </button>
        </div>
      )}

      {mode === 'verify' && (
        <div>
          <h3 style={{ marginBottom: 16 }}>🔐 验证支付密码</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            请输入支付密码以完成此操作。
          </p>
          <input
            type="password"
            placeholder="请输入支付密码"
            value={password}
            onChange={e => setPassword(e.target.value)}
            maxLength={20}
            style={inputStyle}
          />
          {error && <p style={{ color: '#dc2626', fontSize: 13, marginTop: 8 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={handleVerify} style={{ padding: '10px 24px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>
              确认
            </button>
            {onCancel && (
              <button onClick={onCancel} style={{ padding: '10px 24px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                取消
              </button>
            )}
          </div>
        </div>
      )}

      {mode === 'modify' && (
        <div>
          <h3 style={{ marginBottom: 16 }}>🔐 修改支付密码</h3>
          <input
            type="password"
            placeholder="请输入原支付密码"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            maxLength={20}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="请输入新支付密码"
            value={password}
            onChange={e => setPassword(e.target.value)}
            maxLength={20}
            style={{ ...inputStyle, marginTop: 10 }}
          />
          <input
            type="password"
            placeholder="再次输入新支付密码"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            maxLength={20}
            style={{ ...inputStyle, marginTop: 10 }}
          />
          {error && <p style={{ color: '#dc2626', fontSize: 13, marginTop: 8 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={handleModify} style={{ padding: '10px 24px', background: 'var(--btn-primary-bg)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>
              确认修改
            </button>
            {onCancel && (
              <button onClick={onCancel} style={{ padding: '10px 24px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                取消
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid var(--input-border)',
  borderRadius: 8,
  fontSize: 14,
  background: 'var(--input-bg)',
  color: 'var(--text-primary)',
  boxSizing: 'border-box',
};
'use client';
import { useState, useEffect } from 'react';
import SparkModal from '@/components/ui/SparkModal';
import SparkButton from '@/components/ui/SparkButton';
import SparkInput from '@/components/ui/SparkInput';

interface PaymentPasswordProps {
  mode: 'set' | 'verify' | 'modify';
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentPassword({ mode, onSuccess, onCancel }: PaymentPasswordProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [smsCode, setSmsCode] = useState('');
  const [showSms, setShowSms] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const storedPassword = typeof window !== 'undefined' ? localStorage.getItem('payment_password') : null;
  const isLocked = localStorage.getItem('payment_password_locked');

  useEffect(() => {
    if (isLocked) {
      const lockTime = new Date(isLocked);
      if (Date.now() - lockTime.getTime() < 30 * 60 * 1000) {
        setError('账户已被锁定，请30分钟后重试');
      } else {
        localStorage.removeItem('payment_password_locked');
      }
    }
  }, [isLocked]);

  // 发送模拟验证码
  const sendSmsCode = () => {
    if (countdown > 0) return;
    // 模拟发送
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('temp_sms_code', code);
    setSmsSent(true);
    setCountdown(60);
    alert(`验证码已发送（模拟）：${code}`);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validateSms = () => {
    const sentCode = localStorage.getItem('temp_sms_code');
    if (!sentCode) return false;
    if (smsCode === sentCode) {
      localStorage.removeItem('temp_sms_code');
      return true;
    }
    return false;
  };

  const handleSetPassword = () => {
    setError('');
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
    if (!showSms) {
      setShowSms(true);
      sendSmsCode();
      return;
    }
    if (!validateSms()) {
      setError('验证码错误');
      return;
    }
    localStorage.setItem('payment_password', password);
    localStorage.setItem('payment_password_set_at', new Date().toISOString());
    alert('支付密码设置成功！');
    onSuccess();
  };

  const handleVerify = () => {
    setError('');
    if (isLocked) {
      setError('账户已被锁定，请30分钟后重试');
      return;
    }
    if (password !== storedPassword) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) {
        setError('支付密码错误次数过多，账户已锁定30分钟');
        localStorage.setItem('payment_password_locked', new Date().toISOString());
        return;
      }
      setError(`支付密码错误，还剩 ${5 - newAttempts} 次机会`);
      return;
    }
    onSuccess();
  };

  const handleModify = () => {
    setError('');
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
    if (!showSms) {
      setShowSms(true);
      sendSmsCode();
      return;
    }
    if (!validateSms()) {
      setError('验证码错误');
      return;
    }
    localStorage.setItem('payment_password', password);
    alert('支付密码修改成功！');
    onSuccess();
  };

  const title = mode === 'set' ? '🔐 设置支付密码' : mode === 'verify' ? '🔐 验证支付密码' : '🔐 修改支付密码';

  return (
    <SparkModal isOpen={true} onClose={onCancel} title={title}>
      {error && (
        <div style={{ color: 'var(--spark-danger)', fontSize: 'var(--spark-font-size-sm)', marginBottom: 16, padding: 10, background: 'var(--spark-danger-bg)', borderRadius: 'var(--spark-radius-sm)' }}>
          {error}
        </div>
      )}

      {mode === 'modify' && (
        <SparkInput
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="请输入原支付密码"
          style={{ marginBottom: 12 }}
        />
      )}

      <SparkInput
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={mode === 'verify' ? '请输入支付密码' : '请输入新支付密码（6位以上数字）'}
        style={{ marginBottom: 12 }}
      />

      {(mode === 'set' || mode === 'modify') && (
        <SparkInput
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="再次输入支付密码"
          style={{ marginBottom: 12 }}
        />
      )}

      {showSms && (mode === 'set' || mode === 'modify') && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <SparkInput
            type="text"
            value={smsCode}
            onChange={(e) => setSmsCode(e.target.value)}
            placeholder="短信验证码"
            style={{ flex: 1 }}
          />
          <SparkButton variant="secondary" size="sm" onClick={sendSmsCode} disabled={countdown > 0}>
            {countdown > 0 ? `${countdown}s` : '获取验证码'}
          </SparkButton>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
        <SparkButton variant="secondary" onClick={onCancel}>取消</SparkButton>
        <SparkButton
          variant="primary"
          onClick={mode === 'set' ? handleSetPassword : mode === 'verify' ? handleVerify : handleModify}
        >
          {mode === 'set' ? '确认设置' : '确认'}
        </SparkButton>
      </div>
    </SparkModal>
  );
}
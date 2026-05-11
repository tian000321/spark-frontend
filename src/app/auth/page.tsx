'use client';
import { useState } from 'react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email || !password) { setError('请填写邮箱和密码'); return; }
    if (!isLogin && !name) { setError('请填写用户名'); return; }
    const users = JSON.parse(localStorage.getItem('spark_users') || '{}');
    if (!isLogin) {
      if (users[email]) { setError('该邮箱已注册'); return; }
      users[email] = { name, password };
      localStorage.setItem('spark_users', JSON.stringify(users));
      alert('注册成功，请登录');
      setIsLogin(true);
      return;
    }
    if (!users[email] || users[email].password !== password) { setError('邮箱或密码错误'); return; }
    localStorage.setItem('spark_current_user', JSON.stringify({ email, name: users[email].name }));
    window.location.href = '/';
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, textAlign: 'center' }}>{isLogin ? '登录' : '注册'}</h1>
      <p style={{ color: 'var(--spark-text-secondary)', marginBottom: 24, textAlign: 'center' }}>{isLogin ? '欢迎回来' : '创建账号'}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {!isLogin && <input placeholder="用户名" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />}
        <input placeholder="邮箱" type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input placeholder="密码" type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
        {error && <p style={{ color: '#ef4444', fontSize: 13 }}>{error}</p>}
        <button onClick={handleSubmit} style={{ padding: 12, background: 'var(--spark-brand-gradient)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{isLogin ? '登录' : '注册'}</button>
      </div>
      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--spark-text-muted)' }}>
        {isLogin ? '还没有账号？' : '已有账号？'}
        <span onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{ color: 'var(--spark-brand-light)', cursor: 'pointer', fontWeight: 500 }}>{isLogin ? '立即注册' : '去登录'}</span>
      </p>
    </div>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 14, background: 'rgba(255,255,255,0.06)', color: '#fff', boxSizing: 'border-box' };
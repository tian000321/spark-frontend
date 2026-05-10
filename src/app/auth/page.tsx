'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    if (!email || !password) {
      setError('请填写邮箱和密码');
      return;
    }
    if (!isLogin && !name) {
      setError('请填写用户名');
      return;
    }

    // 模拟注册
    if (!isLogin) {
      const users = JSON.parse(localStorage.getItem('spark_users') || '{}');
      if (users[email]) {
        setError('该邮箱已注册，请直接登录');
        return;
      }
      users[email] = { name, password };
      localStorage.setItem('spark_users', JSON.stringify(users));
    }

    // 模拟登录验证
    const users = JSON.parse(localStorage.getItem('spark_users') || '{}');
    if (isLogin && (!users[email] || users[email].password !== password)) {
      setError('邮箱或密码错误');
      return;
    }

    // 登录成功，存储当前会话
    const currentUser = {
      email,
      name: isLogin ? users[email].name : name,
      loggedInAt: new Date().toISOString(),
    };
    localStorage.setItem('spark_current_user', JSON.stringify(currentUser));
    window.location.href = '/';
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
        {isLogin ? '登录' : '注册'}
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24, textAlign: 'center' }}>
        {isLogin ? '欢迎回来，星火科技' : '创建账号，开启你的入驻之旅'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {!isLogin && (
          <input
            placeholder="用户名"
            value={name}
            onChange={e => setName(e.target.value)}
            style={inputStyle}
          />
        )}
        <input
          placeholder="邮箱"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="密码"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />
        {error && <p style={{ color: 'red', fontSize: 13 }}>{error}</p>}
        <button
          onClick={handleSubmit}
          style={{
            padding: 12,
            background: 'var(--btn-primary-bg)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          {isLogin ? '登录' : '注册'}
        </button>
      </div>

      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
        {isLogin ? '还没有账号？' : '已有账号？'}
        <span
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
          style={{ color: 'var(--btn-primary-bg)', cursor: 'pointer', fontWeight: 500 }}
        >
          {isLogin ? '立即注册' : '去登录'}
        </span>
      </p>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid var(--input-border)',
  borderRadius: 8,
  fontSize: 14,
  background: 'var(--input-bg)',
  color: 'var(--text-primary)',
  boxSizing: 'border-box',
};
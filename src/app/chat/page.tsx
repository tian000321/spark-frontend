// 此页面已废弃，Orca助手已替代。访问时直接跳转到首页。
export default function ChatRedirect() {
  if (typeof window !== 'undefined') window.location.href = '/';
  return null;
}
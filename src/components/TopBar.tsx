import ComplianceStatus from './ComplianceStatus';

export default function TopBar() {
  return (
    <div style={{
      height: 64, background: 'rgba(15,15,25,0.7)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex',
      alignItems: 'center', justifyContent: 'flex-end', padding: '0 32px', gap: 20
    }}>
      <ComplianceStatus />
      <span style={{ color: '#F5F5F7', fontWeight: 500, fontSize: 14 }}>田景华</span>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>田</div>
    </div>
  );
}
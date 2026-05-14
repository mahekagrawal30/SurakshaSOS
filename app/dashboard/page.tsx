'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, type UserProfile } from '@/lib/auth';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { AlertCircle, Map, MessageSquare, Phone, Shield, ChevronRight, Bell, Activity } from 'lucide-react';

const QUICK = [
  { href: '/map',          icon: Map,           label: 'Find Help',   sub: 'Nearby hospitals & police', color: '#1e3a5f', accent: '#74d8bd' },
  { href: '/ai-assistant', icon: MessageSquare, label: 'AI Guide',    sub: 'Gemini emergency assistant', color: '#1a2e1a', accent: '#4ade80' },
  { href: '/helplines',    icon: Phone,         label: 'Helplines',   sub: 'Govt emergency numbers', color: '#2d1a1a', accent: '#fbbf24' },
];

const TIPS = [
  'Stay calm — breathe slowly and assess the situation.',
  'Call 112 for any life-threatening emergency in India.',
  'Keep your emergency contact updated in your profile.',
  'In a road accident, turn on hazard lights first.',
  'Do not move an injured person unless there is fire or flood.',
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tip, setTip] = useState(0);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.replace('/'); return; }
    setUser(u);
    const id = setInterval(() => setTip(t => (t + 1) % TIPS.length), 5000);
    return () => clearInterval(id);
  }, [router]);

  if (!user) return null;

  return (
    <div className="page-full">
      {/* Top bar */}
      <div className="topbar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={20} color="var(--primary)" />
            <span className="topbar-title">SurakshaSOS</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Welcome, {user.name.split(' ')[0]} 👋
          </p>
        </div>
        <button className="icon-btn" onClick={() => router.push('/profile')}>
          <Bell size={18} />
        </button>
      </div>

      <div className="page">
        {/* Status */}
        <div className="fade-up" style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'var(--surface)', border: '1px solid rgba(116,216,189,0.25)',
            borderRadius: 'var(--r-lg)', padding: '14px 18px',
          }}>
            <Activity size={18} color="var(--tertiary)" />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--tertiary)' }}>SYSTEM ACTIVE</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Emergency services ready</p>
            </div>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--tertiary)', animation: 'blink 2s ease infinite' }} />
          </div>
        </div>

        {/* Big SOS */}
        <div className="fade-up-1" style={{ marginBottom: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1f0a0e 0%, #2d0d15 100%)',
            border: '1px solid rgba(225,29,72,0.3)', borderRadius: 'var(--r-xl)', padding: '28px 24px',
            textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px',
              borderRadius: '50%', background: 'radial-gradient(circle, rgba(225,29,72,0.2) 0%, transparent 70%)',
            }} />
            <AlertCircle size={28} color="var(--primary)" style={{ marginBottom: '12px' }} />
            <h2 className="t-h2" style={{ marginBottom: '6px' }}>Emergency SOS</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
              Hold button 3 seconds to alert emergency services
            </p>
            <Link href="/sos" className="btn btn-primary" style={{ fontSize: '17px', animation: 'glow-pulse 2.5s ease-in-out infinite' }}>
              <AlertCircle size={22} /> Activate SOS
            </Link>
          </div>
        </div>

        {/* Quick actions */}
        <div className="fade-up-2" style={{ marginBottom: '24px' }}>
          <p className="t-label t-muted" style={{ marginBottom: '14px' }}>Quick Actions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {QUICK.map(({ href, icon: Icon, label, sub, color, accent }) => (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                background: color, border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 'var(--r-lg)', padding: '16px 18px', textDecoration: 'none', color: 'inherit',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--r-md)', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={22} color={accent} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '16px', marginBottom: '2px' }}>{label}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{sub}</p>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </Link>
            ))}
          </div>
        </div>

        {/* Safety tip */}
        <div className="fade-up-3">
          <p className="t-label t-muted" style={{ marginBottom: '12px' }}>Safety Tip</p>
          <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', padding: '18px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '20px' }}>💡</span>
              <p style={{ fontSize: '14px', lineHeight: '22px', color: 'var(--secondary)', transition: 'opacity 0.4s' }}>{TIPS[tip]}</p>
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '14px' }}>
              {TIPS.map((_, i) => <div key={i} style={{ height: '3px', flex: 1, borderRadius: '2px', background: i === tip ? 'var(--primary)' : 'var(--surface-high)', transition: 'background 0.3s' }} />)}
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}

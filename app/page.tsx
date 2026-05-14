'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import { Shield, Zap, MapPin, MessageSquare } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) router.replace('/dashboard');
  }, [router]);

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: '0 24px' }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '-120px', left: '50%', transform: 'translateX(-50%)',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(225,29,72,0.18) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Hero */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '32px', paddingTop: '60px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div className="fade-up" style={{ position: 'relative' }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '28px',
            background: 'linear-gradient(135deg, #e11d48 0%, #be0037 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 20px 60px rgba(225,29,72,0.5)',
            margin: '0 auto',
          }}>
            <Shield size={52} color="#fff" strokeWidth={2.5} />
          </div>
          {/* Rings */}
          <div style={{ position: 'absolute', inset: '-16px', borderRadius: '44px', border: '2px solid rgba(225,29,72,0.3)', animation: 'pulse-ring 2s ease-out infinite' }} />
          <div style={{ position: 'absolute', inset: '-32px', borderRadius: '60px', border: '1px solid rgba(225,29,72,0.15)', animation: 'pulse-ring 2s 0.5s ease-out infinite' }} />
        </div>

        {/* Title */}
        <div className="fade-up-1">
          <h1 className="t-display" style={{ marginBottom: '8px' }}>
            Suraksha<span style={{ color: 'var(--primary)' }}>SOS</span>
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.01em' }}>
            Your Emergency, Our Priority
          </p>
        </div>

        {/* Feature pills */}
        <div className="fade-up-2" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '320px' }}>
          {[
            { icon: <Zap size={16} />, text: 'Instant SOS with one hold' },
            { icon: <MapPin size={16} />, text: 'Live map to nearby help' },
            { icon: <MessageSquare size={16} />, text: 'Gemini AI emergency guide' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 'var(--r-lg)', padding: '14px 18px',
            }}>
              <span style={{ color: 'var(--primary)' }}>{f.icon}</span>
              <span style={{ fontSize: '15px', fontWeight: 500 }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="fade-up-3" style={{ padding: '32px 0 48px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button className="btn btn-primary" onClick={() => router.push('/signup')} style={{ fontSize: '17px' }}>
          <Shield size={20} /> Get Started — It&apos;s Free
        </button>
        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          No verification needed · Quick one-time setup
        </p>
      </div>
    </div>
  );
}

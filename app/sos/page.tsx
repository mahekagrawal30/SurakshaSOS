'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import Navigation from '@/components/Navigation';
import { Shield, X, Phone, MapPin, CheckCircle } from 'lucide-react';

type Phase = 'idle' | 'holding' | 'active' | 'sent';

export default function SOSPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [user, setUser] = useState<{ name: string; emergencyContactName: string } | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.replace('/'); return; }
    setUser(u);
  }, [router]);

  const startHold = () => {
    if (phase !== 'idle') return;
    setPhase('holding');
    setProgress(0);
    let p = 0;
    holdTimer.current = setInterval(() => {
      p += 100 / 30; // 3 seconds = 30 × 100ms
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(holdTimer.current!);
        triggerSOS();
      }
    }, 100);
  };

  const cancelHold = () => {
    if (phase !== 'holding') return;
    clearInterval(holdTimer.current!);
    setPhase('idle');
    setProgress(0);
  };

  const triggerSOS = () => {
    setPhase('active');
    setProgress(100);
    let c = 10;
    countdownTimer.current = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(countdownTimer.current!);
        setPhase('sent');
      }
    }, 1000);
  };

  const cancelSOS = () => {
    clearInterval(countdownTimer.current!);
    setPhase('idle');
    setProgress(0);
    setCountdown(10);
  };

  useEffect(() => () => {
    clearInterval(holdTimer.current!);
    clearInterval(countdownTimer.current!);
  }, []);

  return (
    <div className="page-full" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Top */}
      <div className="topbar">
        <h1 className="t-h2">Emergency SOS</h1>
        <button className="icon-btn" onClick={() => router.back()}><X size={20} /></button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', gap: '32px' }}>

        {/* Full-screen red pulse when active */}
        {phase === 'active' && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(225,29,72,0.06)', pointerEvents: 'none', zIndex: 0, animation: 'glow-pulse 1s ease-in-out infinite' }} />
        )}

        {/* Status */}
        {phase === 'sent' ? (
          <div style={{ textAlign: 'center', animation: 'fade-up 0.4s ease' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--tertiary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={40} color="var(--tertiary)" />
            </div>
            <h2 className="t-h1" style={{ color: 'var(--tertiary)', marginBottom: '10px' }}>HELP IS EN ROUTE</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '24px' }}>
              Emergency services have been alerted.<br />
              {user?.emergencyContactName} has been notified.
            </p>
          </div>
        ) : (
          <>
            {/* Instruction */}
            <div style={{ textAlign: 'center' }}>
              {phase === 'idle' && <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Hold the button for <strong style={{ color: 'var(--text)' }}>3 seconds</strong> to send SOS</p>}
              {phase === 'holding' && <p style={{ color: 'var(--primary-light)', fontSize: '16px', fontWeight: 600 }}>Keep holding…</p>}
              {phase === 'active' && (
                <div style={{ textAlign: 'center' }}>
                  <p className="t-label" style={{ color: 'var(--primary)', marginBottom: '8px', animation: 'blink 1s ease infinite' }}>● SENDING SOS</p>
                  <p className="t-display" style={{ color: 'var(--primary)' }}>{countdown}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>seconds until alert sent</p>
                </div>
              )}
            </div>

            {/* SOS Circle Button */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Pulse rings */}
              {(phase === 'holding' || phase === 'active') && <>
                <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', border: '2px solid rgba(225,29,72,0.5)', animation: 'pulse-ring 1.2s ease-out infinite' }} />
                <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', border: '2px solid rgba(225,29,72,0.3)', animation: 'pulse-ring 1.2s 0.4s ease-out infinite' }} />
              </>}

              {/* Progress ring */}
              {phase === 'holding' && (
                <svg style={{ position: 'absolute', width: '188px', height: '188px', transform: 'rotate(-90deg)' }}>
                  <circle cx="94" cy="94" r="88" fill="none" stroke="rgba(225,29,72,0.2)" strokeWidth="4" />
                  <circle cx="94" cy="94" r="88" fill="none" stroke="#e11d48" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 88}`} strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.1s linear' }} />
                </svg>
              )}

              <button
                onMouseDown={startHold} onMouseUp={cancelHold} onMouseLeave={cancelHold}
                onTouchStart={startHold} onTouchEnd={cancelHold}
                style={{
                  width: '160px', height: '160px', borderRadius: '50%', border: 'none',
                  background: phase === 'active'
                    ? 'linear-gradient(135deg,#ff3366,#e11d48)'
                    : 'linear-gradient(135deg,#e11d48,#be0037)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: phase === 'active' ? 'default' : 'pointer',
                  boxShadow: '0 0 40px rgba(225,29,72,0.6)',
                  transform: phase === 'holding' ? 'scale(0.95)' : 'scale(1)',
                  transition: 'transform 0.1s, box-shadow 0.2s',
                  userSelect: 'none', WebkitUserSelect: 'none',
                }}
              >
                <Shield size={40} color="#fff" strokeWidth={2.5} />
                <span style={{ color: '#fff', fontWeight: 900, fontSize: '22px', letterSpacing: '0.08em', marginTop: '6px' }}>SOS</span>
              </button>
            </div>

            {/* Cancel */}
            {phase === 'active' && (
              <button className="btn btn-ghost" onClick={cancelSOS} style={{ maxWidth: '200px' }}>
                <X size={18} /> Cancel
              </button>
            )}
          </>
        )}

        {/* Info cards */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a href="tel:112" style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', padding: '14px 18px', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--r-md)', background: 'rgba(225,29,72,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={18} color="var(--primary)" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '15px' }}>Call 112</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>National Emergency Number</p>
            </div>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', padding: '14px 18px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--r-md)', background: 'rgba(116,216,189,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={18} color="var(--tertiary)" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '15px' }}>Sharing your location</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>GPS coordinates sent with alert</p>
            </div>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}

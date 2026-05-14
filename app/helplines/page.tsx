'use client';
import Navigation from '@/components/Navigation';
import { Phone, Shield, Flame, Heart, Car, AlertTriangle, Users, Lock } from 'lucide-react';

const LINES = [
  { num: '112', label: 'National Emergency', sub: 'Police · Fire · Ambulance', icon: Shield, color: '#e11d48', bg: 'rgba(225,29,72,0.12)' },
  { num: '100', label: 'Police', sub: 'Crime & Law enforcement', icon: Shield, color: '#60a5fa', bg: 'rgba(96,165,250,0.12)' },
  { num: '101', label: 'Fire Brigade', sub: 'Fire & Rescue', icon: Flame, color: '#fb923c', bg: 'rgba(251,146,60,0.12)' },
  { num: '102', label: 'Ambulance', sub: 'Medical Emergency', icon: Heart, color: '#f472b6', bg: 'rgba(244,114,182,0.12)' },
  { num: '108', label: 'Emergency Ambulance', sub: 'Free ambulance service', icon: Heart, color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  { num: '1073', label: 'Road Accident', sub: 'National highway helpline', icon: Car, color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  { num: '1091', label: "Women's Helpline", sub: 'Safety & support for women', icon: Users, color: '#f9a8d4', bg: 'rgba(249,168,212,0.12)' },
  { num: '1930', label: 'Cyber Crime', sub: 'Online fraud & cybercrime', icon: Lock, color: '#67e8f9', bg: 'rgba(103,232,249,0.12)' },
  { num: '14567', label: 'Senior Citizen', sub: 'Elderly care & support', icon: Users, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  { num: '1800-180-1104', label: 'Road Transport', sub: 'Vehicle & transport helpline', icon: Car, color: '#86efac', bg: 'rgba(134,239,172,0.12)' },
];

export default function HelplinesPage() {
  return (
    <div className="page-full">
      <div className="topbar">
        <div>
          <h1 className="t-h2">Helplines</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>Tap to call instantly</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(225,29,72,0.12)', borderRadius: 'var(--r-full)', padding: '6px 12px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', animation: 'blink 1.5s ease infinite' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>24/7</span>
        </div>
      </div>

      <div className="page">
        {/* Banner */}
        <div className="fade-up" style={{ background: 'linear-gradient(135deg,#1f0a0e,#2a0d14)', border: '1px solid rgba(225,29,72,0.25)', borderRadius: 'var(--r-xl)', padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: 'var(--r-lg)', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertTriangle size={26} color="#fff" />
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: '17px' }}>Tap any number to call</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '3px' }}>All helplines are free & available 24/7</p>
          </div>
        </div>

        <p className="t-label t-muted" style={{ marginBottom: '14px' }}>Government Emergency Numbers</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {LINES.map(({ num, label, sub, icon: Icon, color, bg }, i) => (
            <a
              key={num}
              href={`tel:${num}`}
              className="fade-up"
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 'var(--r-lg)', padding: '16px 18px',
                textDecoration: 'none', color: 'inherit',
                animationDelay: `${i * 0.04}s`,
                transition: 'transform 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-high)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--r-md)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} color={color} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '2px' }}>{label}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 900, fontSize: '18px', color, fontVariantNumeric: 'tabular-nums' }}>{num}</span>
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--r-full)', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={14} color="#fff" strokeWidth={2.5} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <Navigation />
    </div>
  );
}

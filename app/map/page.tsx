'use client';
import dynamic from 'next/dynamic';
import Navigation from '@/components/Navigation';
import { MapPin, Hospital, Shield, Flame, Navigation2, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const MapClient = dynamic(() => import('@/components/MapClient'), { ssr: false });

const PLACE_TYPES = [
  { key: 'all',      label: 'All',       color: 'var(--text)' },
  { key: 'hospital', label: 'Hospitals', color: '#74d8bd' },
  { key: 'police',   label: 'Police',    color: '#60a5fa' },
  { key: 'fire',     label: 'Fire',      color: '#fb923c' },
];

const LEGEND = [
  { color: '#e11d48', label: 'You' },
  { color: '#74d8bd', label: 'Hospital' },
  { color: '#60a5fa', label: 'Police' },
  { color: '#fb923c', label: 'Fire Station' },
];

export default function MapPage() {
  const [filter, setFilter] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="page-full" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div className="topbar">
        <div>
          <h1 className="t-h2">Nearby Help</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Hospitals · Police · Fire stations
          </p>
        </div>
        <button
          className="icon-btn"
          onClick={() => setRefreshKey(k => k + 1)}
          title="Refresh location"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Filter pills */}
      <div style={{ padding: '0 24px 12px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {PLACE_TYPES.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              flexShrink: 0,
              padding: '7px 16px',
              borderRadius: 'var(--r-full)',
              border: `1.5px solid ${filter === key ? color : 'var(--outline)'}`,
              background: filter === key ? `${color}22` : 'transparent',
              color: filter === key ? color : 'var(--text-muted)',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.18s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative', minHeight: '340px', margin: '0 16px', borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
        <MapClient key={refreshKey} filter={filter} />
      </div>

      {/* Legend */}
      <div style={{ padding: '14px 24px 0', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {LEGEND.map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, border: '2px solid rgba(255,255,255,0.6)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Quick call strip */}
      <div style={{ padding: '16px 24px 96px', display: 'flex', gap: '10px' }}>
        {[
          { num: '112', label: 'Emergency', color: '#e11d48', Icon: Shield },
          { num: '102', label: 'Ambulance', color: '#74d8bd', Icon: Hospital },
          { num: '101', label: 'Fire',      color: '#fb923c', Icon: Flame },
          { num: '100', label: 'Police',    color: '#60a5fa', Icon: Navigation2 },
        ].map(({ num, label, color, Icon }) => (
          <a
            key={num}
            href={`tel:${num}`}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '6px', textDecoration: 'none',
              background: 'var(--surface)', border: `1px solid ${color}33`,
              borderRadius: 'var(--r-lg)', padding: '12px 4px',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={16} color={color} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}>{num}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.03em' }}>{label}</span>
          </a>
        ))}
      </div>

      <Navigation />
    </div>
  );
}

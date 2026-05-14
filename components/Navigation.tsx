'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, AlertCircle, Map, MessageSquare, User } from 'lucide-react';

const NAV = [
  { href: '/dashboard',    icon: Home,          label: 'Home' },
  { href: '/sos',          icon: AlertCircle,   label: 'SOS' },
  { href: '/map',          icon: Map,           label: 'Map' },
  { href: '/ai-assistant', icon: MessageSquare, label: 'AI' },
  { href: '/profile',      icon: User,          label: 'Profile' },
];

export default function Navigation() {
  const path = usePathname();

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: '480px',
      background: 'rgba(18,20,20,0.92)', backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', alignItems: 'center',
      padding: '8px 0 env(safe-area-inset-bottom, 8px)',
      zIndex: 100,
    }}>
      {NAV.map(({ href, icon: Icon, label }) => {
        const active = path === href;
        const isSOS = href === '/sos';
        return (
          <Link key={href} href={href} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '4px', textDecoration: 'none', padding: '6px 0',
            color: active ? (isSOS ? 'var(--primary)' : 'var(--primary-light)') : 'var(--text-muted)',
            transition: 'color 0.15s',
          }}>
            {isSOS ? (
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: active ? 'var(--primary)' : 'var(--surface-high)',
                border: `2px solid ${active ? 'var(--primary)' : 'var(--outline)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: '-16px',
                boxShadow: active ? '0 4px 20px rgba(225,29,72,0.5)' : 'none',
                transition: 'all 0.2s',
              }}>
                <Icon size={22} color={active ? '#fff' : 'var(--primary)'} strokeWidth={2.5} />
              </div>
            ) : (
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            )}
            <span style={{ fontSize: '10px', fontWeight: active ? 700 : 500, letterSpacing: '0.03em' }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

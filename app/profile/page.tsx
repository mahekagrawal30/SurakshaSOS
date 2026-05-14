'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, saveUser, clearUser, type UserProfile } from '@/lib/auth';
import Navigation from '@/components/Navigation';
import {
  User, Phone, Heart, Shield, LogOut, Edit3, Check, X,
  ChevronRight, Bell, Info, Star,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<UserProfile>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.replace('/'); return; }
    setUser(u);
    setForm(u);
  }, [router]);

  const handleSave = () => {
    if (!form.name?.trim() || !form.phone?.trim()) return;
    const updated = { ...user!, ...form } as UserProfile;
    saveUser(updated);
    setUser(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    clearUser();
    router.replace('/');
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="page-full" style={{ minHeight: '100dvh' }}>
      {/* Top bar */}
      <div className="topbar">
        <h1 className="t-h2">Profile</h1>
        <button
          className="icon-btn"
          onClick={() => { setEditing(e => !e); setSaved(false); setForm(user); }}
        >
          {editing ? <X size={18} /> : <Edit3 size={18} />}
        </button>
      </div>

      <div className="page">
        {/* Avatar card */}
        <div className="fade-up" style={{
          background: 'linear-gradient(135deg, #1a0d12, #2d1520)',
          border: '1px solid rgba(225,29,72,0.2)',
          borderRadius: 'var(--r-xl)', padding: '28px 24px',
          marginBottom: '24px', textAlign: 'center',
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #e11d48, #be0037)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', fontSize: '28px', fontWeight: 900, color: '#fff',
            boxShadow: '0 12px 36px rgba(225,29,72,0.4)',
          }}>
            {initials}
          </div>
          <h2 className="t-h2" style={{ marginBottom: '4px' }}>{user.name}</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>+91 {user.phone}</p>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(116,216,189,0.12)', borderRadius: 'var(--r-full)',
            padding: '6px 14px', marginTop: '14px',
          }}>
            <Shield size={12} color="var(--tertiary)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--tertiary)' }}>Protected · Member since {memberSince}</span>
          </div>
        </div>

        {/* Edit / View: Personal Info */}
        <div className="fade-up-1" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <User size={15} color="var(--primary)" />
            <span className="t-label" style={{ color: 'var(--primary)' }}>Your Info</span>
          </div>

          {editing ? (
            <div className="card">
              <div className="field">
                <label>Full Name</label>
                <input className="input" value={form.name ?? ''} onChange={set('name')} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Mobile Number</label>
                <input className="input" value={form.phone ?? ''} onChange={set('phone')} maxLength={10} inputMode="numeric" />
              </div>
            </div>
          ) : (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Row icon={<User size={16} />} label="Full Name" value={user.name} />
              <div className="divider" style={{ margin: '0' }} />
              <Row icon={<Phone size={16} />} label="Mobile" value={`+91 ${user.phone}`} />
            </div>
          )}
        </div>

        {/* Emergency Contact */}
        <div className="fade-up-2" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Heart size={15} color="var(--tertiary)" />
            <span className="t-label" style={{ color: 'var(--tertiary)' }}>Emergency Contact</span>
          </div>

          {editing ? (
            <div className="card" style={{ border: '1px solid rgba(116,216,189,0.2)' }}>
              <div className="field">
                <label>Contact Name</label>
                <input className="input" value={form.emergencyContactName ?? ''} onChange={set('emergencyContactName')} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Contact Number</label>
                <input className="input" value={form.emergencyContactPhone ?? ''} onChange={set('emergencyContactPhone')} maxLength={10} inputMode="numeric" />
              </div>
            </div>
          ) : (
            <div className="card" style={{ border: '1px solid rgba(116,216,189,0.12)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Row icon={<User size={16} color="var(--tertiary)" />} label="Name" value={user.emergencyContactName} accent />
              <div className="divider" style={{ margin: '0' }} />
              <Row icon={<Phone size={16} color="var(--tertiary)" />} label="Number" value={`+91 ${user.emergencyContactPhone}`} accent />
            </div>
          )}
        </div>

        {/* Save button (edit mode) */}
        {editing && (
          <div className="fade-up" style={{ marginBottom: '16px' }}>
            <button className="btn btn-primary" onClick={handleSave} style={{ fontSize: '16px' }}>
              <Check size={20} /> Save Changes
            </button>
          </div>
        )}

        {/* Success toast */}
        {saved && (
          <div className="fade-up" style={{
            background: 'var(--tertiary-container)', borderRadius: 'var(--r-lg)',
            padding: '14px 18px', marginBottom: '16px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <Check size={18} color="var(--tertiary)" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--on-tertiary-container)' }}>Profile updated successfully</span>
          </div>
        )}

        {/* App info section */}
        {!editing && (
          <div className="fade-up-3" style={{ marginBottom: '16px' }}>
            <p className="t-label t-muted" style={{ marginBottom: '12px' }}>App</p>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { icon: <Bell size={16} />, label: 'Notifications', value: 'Enabled' },
                { icon: <Star size={16} />, label: 'App version', value: '1.0.0' },
                { icon: <Info size={16} />, label: 'Data storage', value: 'Local only' },
              ].map(({ icon, label, value }, i) => (
                <div key={label}>
                  {i > 0 && <div className="divider" style={{ margin: '12px 0' }} />}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
                    <span style={{ flex: 1, fontSize: '15px', fontWeight: 500 }}>{label}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>{value}</span>
                    <ChevronRight size={15} color="var(--text-muted)" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        {!editing && (
          <div className="fade-up-4">
            <button
              className="btn btn-ghost"
              onClick={handleLogout}
              style={{ color: 'var(--primary)', borderColor: 'rgba(225,29,72,0.3)', fontSize: '15px' }}
            >
              <LogOut size={18} /> Sign Out &amp; Clear Data
            </button>
            <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '10px' }}>
              This will remove all locally stored data
            </p>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  );
}

function Row({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ color: accent ? 'var(--tertiary)' : 'var(--text-muted)' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</p>
        <p style={{ fontSize: '16px', fontWeight: 600 }}>{value}</p>
      </div>
    </div>
  );
}

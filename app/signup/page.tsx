'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveUser } from '@/lib/auth';
import { Shield, User, Phone, Heart, ChevronRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', emergencyContactName: '', emergencyContactPhone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number';
    if (!form.emergencyContactName.trim()) e.emergencyContactName = 'Contact name required';
    if (!/^\d{10}$/.test(form.emergencyContactPhone)) e.emergencyContactPhone = 'Enter a valid 10-digit number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    saveUser({ ...form, createdAt: new Date().toISOString() });
    router.replace('/dashboard');
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div style={{ minHeight: '100dvh', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '48px 24px 24px', textAlign: 'center' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '18px', margin: '0 auto 20px',
          background: 'linear-gradient(135deg,#e11d48,#be0037)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 32px rgba(225,29,72,0.4)',
        }}>
          <Shield size={32} color="#fff" />
        </div>
        <h1 className="t-h1" style={{ marginBottom: '8px' }}>Create Your Profile</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>One-time setup · No verification needed</p>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '0 24px 48px' }}>
        {/* Personal Info */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <User size={16} color="var(--primary)" />
            <span className="t-label" style={{ color: 'var(--primary)' }}>Your Info</span>
          </div>
          <div className="field">
            <label>Full Name</label>
            <input className="input" placeholder="Priya Sharma" value={form.name} onChange={set('name')} />
            {errors.name && <p style={{ color: 'var(--error)', fontSize: '13px', marginTop: '6px' }}>{errors.name}</p>}
          </div>
          <div className="field">
            <label>Mobile Number</label>
            <input className="input" placeholder="9876543210" maxLength={10} value={form.phone} onChange={set('phone')} inputMode="numeric" />
            {errors.phone && <p style={{ color: 'var(--error)', fontSize: '13px', marginTop: '6px' }}>{errors.phone}</p>}
          </div>
        </div>

        {/* Emergency Contact */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Heart size={16} color="var(--tertiary)" />
            <span className="t-label" style={{ color: 'var(--tertiary)' }}>Emergency Contact</span>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid rgba(116,216,189,0.2)', borderRadius: 'var(--r-lg)', padding: '20px' }}>
            <div className="field">
              <label>Contact Name</label>
              <input className="input" placeholder="Rahul Sharma" value={form.emergencyContactName} onChange={set('emergencyContactName')} />
              {errors.emergencyContactName && <p style={{ color: 'var(--error)', fontSize: '13px', marginTop: '6px' }}>{errors.emergencyContactName}</p>}
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Contact Number</label>
              <input className="input" placeholder="9876543210" maxLength={10} value={form.emergencyContactPhone} onChange={set('emergencyContactPhone')} inputMode="numeric" />
              {errors.emergencyContactPhone && <p style={{ color: 'var(--error)', fontSize: '13px', marginTop: '6px' }}>{errors.emergencyContactPhone}</p>}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving} style={{ fontSize: '17px', position: 'relative' }}>
          {saving ? (
            <span style={{ width: '22px', height: '22px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
          ) : (
            <><Phone size={20} /> Save &amp; Enter App <ChevronRight size={18} /></>
          )}
        </button>

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginTop: '16px' }}>
          Your data is stored locally on this device only
        </p>
      </form>
    </div>
  );
}

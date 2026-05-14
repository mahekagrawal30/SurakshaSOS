'use client';
import { useState, useRef, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { MessageSquare, Send, Mic, ChevronDown, Zap, RotateCcw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  ts: number;
}

const QUICK_PROMPTS = [
  '🚗 Road accident – what do I do?',
  '🔥 Someone caught fire nearby',
  '💊 Possible drug overdose',
  '🫀 CPR steps quickly',
  '🐍 Snake bite first aid',
  '🌊 Drowning person nearby',
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setInput('');

    const userMsg: Message = { role: 'user', text: trimmed, ts: Date.now() };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
          })),
        }),
      });

      const data = await res.json() as { text?: string; error?: string };
      const reply = data.text ?? '⚠️ Could not reach AI. Please call 112 for emergencies.';
      setMessages(prev => [...prev, { role: 'assistant', text: reply, ts: Date.now() }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: '⚠️ No connection. For emergencies call 112.',
        ts: Date.now(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) { alert('Voice input not supported in this browser.'); return; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = new SR() as any;
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => send(e.results[0][0].transcript);
    rec.start();
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <div className="page-full" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: 'var(--r-md)',
            background: 'linear-gradient(135deg, #0a1f0a, #00836c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={18} color="var(--tertiary)" />
          </div>
          <div>
            <h1 style={{ fontSize: '17px', fontWeight: 800 }}>AI Emergency Guide</h1>
            <p style={{ fontSize: '12px', color: 'var(--tertiary)', fontWeight: 600 }}>● Powered by Gemini</p>
          </div>
        </div>
        <button className="icon-btn" onClick={() => { setMessages([]); setInput(''); }} title="Clear chat">
          <RotateCcw size={16} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 8px' }}>
        {messages.length === 0 && (
          <div style={{ paddingTop: '16px' }}>
            <div className="fade-up" style={{
              background: 'linear-gradient(135deg,#0a1f0a,#0f2e1f)',
              border: '1px solid rgba(116,216,189,0.2)',
              borderRadius: 'var(--r-xl)', padding: '24px 20px',
              textAlign: 'center', marginBottom: '24px',
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'rgba(116,216,189,0.15)', border: '2px solid rgba(116,216,189,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px',
              }}>
                <MessageSquare size={26} color="var(--tertiary)" />
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Ask me anything</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '22px' }}>
                Describe your emergency and I&apos;ll give you step-by-step guidance instantly.
              </p>
            </div>

            <p className="t-label t-muted" style={{ marginBottom: '12px' }}>Quick scenarios</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {QUICK_PROMPTS.map(q => (
                <button key={q} onClick={() => send(q)} style={{
                  background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 'var(--r-lg)', padding: '14px 16px',
                  color: 'var(--text)', fontFamily: 'inherit', fontSize: '15px',
                  fontWeight: 500, cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-high)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; }}
                >
                  {q}
                  <ChevronDown size={16} color="var(--text-muted)" style={{ transform: 'rotate(-90deg)', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{
            marginBottom: '12px', display: 'flex',
            justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            animation: 'fade-up 0.25s ease both',
          }}>
            {m.role === 'assistant' && (
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                background: 'var(--tertiary-container)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginRight: '8px', marginTop: '4px',
              }}>
                <Zap size={13} color="var(--tertiary)" />
              </div>
            )}
            <div style={{
              maxWidth: '82%',
              background: m.role === 'user' ? 'linear-gradient(135deg,#e11d48,#be0037)' : 'var(--surface)',
              border: m.role === 'assistant' ? '1px solid rgba(255,255,255,0.07)' : 'none',
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
              padding: '12px 16px',
            }}>
              <p style={{
                fontSize: '15px', lineHeight: '24px', whiteSpace: 'pre-wrap',
                color: m.role === 'user' ? '#fff' : 'var(--text)',
              }}>{m.text}</p>
              <p style={{
                fontSize: '11px', marginTop: '4px',
                color: m.role === 'user' ? 'rgba(255,255,255,0.55)' : 'var(--text-muted)',
              }}>
                {new Date(m.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
              background: 'var(--tertiary-container)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={13} color="var(--tertiary)" />
            </div>
            <div style={{
              background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '4px 18px 18px 18px', padding: '14px 18px',
              display: 'flex', gap: '6px', alignItems: 'center',
            }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: 'var(--tertiary)',
                  animation: `blink 1.2s ${j * 0.2}s ease-in-out infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={{
        padding: '12px 16px 96px', borderTop: '1px solid rgba(255,255,255,0.06)',
        background: 'var(--bg)', display: 'flex', gap: '10px', alignItems: 'flex-end',
      }}>
        <button onClick={startVoice} style={{
          width: '48px', height: '48px', borderRadius: '50%', border: 'none', flexShrink: 0,
          background: listening ? 'var(--primary)' : 'var(--surface-high)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s',
          animation: listening ? 'glow-pulse 1s ease-in-out infinite' : 'none',
        }}>
          <Mic size={20} color={listening ? '#fff' : 'var(--text-muted)'} />
        </button>

        <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey} placeholder="Describe your emergency…" rows={1}
          style={{
            flex: 1, background: 'var(--surface-high)',
            border: '1.5px solid var(--outline)', borderRadius: 'var(--r-lg)',
            color: 'var(--text)', fontFamily: 'inherit', fontSize: '16px',
            padding: '13px 16px', outline: 'none', resize: 'none',
            maxHeight: '120px', overflowY: 'auto', lineHeight: '22px',
            transition: 'border-color 0.18s',
          }}
          onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--tertiary)'; }}
          onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = 'var(--outline)'; }}
        />

        <button onClick={() => send(input)} disabled={!input.trim() || loading} style={{
          width: '48px', height: '48px', borderRadius: '50%', border: 'none', flexShrink: 0,
          background: input.trim() && !loading ? 'var(--tertiary-container)' : 'var(--surface-high)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
          transition: 'background 0.2s',
        }}>
          <Send size={18} color={input.trim() && !loading ? 'var(--tertiary)' : 'var(--text-muted)'} />
        </button>
      </div>

      <Navigation />
    </div>
  );
}

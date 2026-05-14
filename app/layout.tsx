import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SurakshaSOS – AI Emergency Response',
  description: 'Your AI-powered emergency response companion. Instant SOS, live maps, Gemini AI assistant, and government helplines — all in one app.',
  keywords: ['emergency', 'SOS', 'safety', 'AI assistant', 'India', 'helpline'],
};

export const viewport: Viewport = {
  themeColor: '#e11d48',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '⚽ Football AI Analyst',
  description: 'AI-powered football analysis, live scores, match predictions & more',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}

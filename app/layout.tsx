import type React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YYC³ Smart Service Engine | 智能服务平台',
  description: 'YYC³ Smart Service Engine - AI-Powered Digital Human Assistant with TTS, Image Generation, and Conversational AI',
  keywords: ['YYC³', 'Smart Service', 'Digital Human', 'AI', 'TTS', 'Image Generation', 'Conversational AI'],
  authors: [{ name: 'YYC-Cube Team' }],
  creator: 'YYC-Cube',
  publisher: 'YanYuCloudCube',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

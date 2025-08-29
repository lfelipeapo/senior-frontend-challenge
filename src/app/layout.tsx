import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'Conecta Frontend Challenge',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<Readonly<RootLayoutProps>> = ({ children }) => {
  return (
    <html lang='pt-br'>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
};

export default RootLayout;


// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MyNotes - A Modern Note-Taking App',
  description: 'A simple and modern note-taking app built with Next.js, React, and TypeScript',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
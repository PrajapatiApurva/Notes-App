// src/app/components/FloatingActionButton.tsx
'use client';

import Link from 'next/link';

export default function FloatingActionButton() {
  return (
    <Link href="/create">
      <div className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition duration-200 cursor-pointer">
        <span className="text-2xl">➕</span>
      </div>
    </Link>
  );
}
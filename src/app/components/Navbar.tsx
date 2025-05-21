'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path
      ? 'text-blue-500 font-bold'
      : 'text-gray-600 hover:text-blue-500';
  };

  return (
    <nav className="sticky top-0 z-10 w-full bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold text-blue-600">
          MyNotes
        </Link>

        {/* Hamburger (mobile only) */}
        <button
          className="md:hidden text-gray-600 hover:text-blue-500"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Nav Links (Desktop) */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className={`${isActive('/')} transition duration-200`}>
            Home
          </Link>
          <Link
            href="/dashboard"
            className={`${isActive('/dashboard')} transition duration-200`}
          >
            Dashboard
          </Link>
          <Link
            href="/create"
            className={`${isActive('/create')} transition duration-200`}
          >
            Create Note
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 px-4">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`${isActive('/')} block transition duration-200`}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className={`${isActive('/dashboard')} block transition duration-200`}
          >
            Dashboard
          </Link>
          <Link
            href="/create"
            onClick={() => setIsOpen(false)}
            className={`${isActive('/create')} block transition duration-200`}
          >
            Create Note
          </Link>
        </div>
      )}
    </nav>
  );
}

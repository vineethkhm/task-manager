import React from 'react';
import Link from 'next/link';
import { LayoutGrid, Moon, SunMedium } from 'lucide-react';

const Navbar = ({ onLogout, isDark, onToggleDark }) => {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white shadow-sm">
            <LayoutGrid className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-wide text-white">Task Manager</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDark}
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Moon className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center justify-center rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
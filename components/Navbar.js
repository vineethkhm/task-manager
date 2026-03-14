import React from 'react';
import Link from 'next/link';

const Logo = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4H20V20H4V4Z" fill="currentColor" fillOpacity="0.15" />
    <path d="M8 8H16V16H8V8Z" fill="currentColor" />
  </svg>
);

export default function Navbar({ onLogout, isDark, onToggleDark }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-white/70 backdrop-blur-md shadow-sm dark:border-slate-800/60 dark:bg-slate-900/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-rose-500 text-white shadow-lg">
            <Logo />
          </div>
          <span className="text-lg font-semibold text-slate-900 dark:text-white">Task Manager</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDark}
            className="inline-flex items-center justify-center rounded-full border border-slate-200/60 bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-white dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-100"
            aria-label="Toggle dark mode"
          >
            {isDark ? '🌙' : '☀️'}
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

import React from 'react';
import Link from 'next/link';

const Navbar = ({ onLogout, isDark, onToggleDark }) => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">

        <Link href="/dashboard" className="text-xl font-bold">
          Task Manager
        </Link>

        <div className="flex gap-3">

          <button
            onClick={onToggleDark}
            className="bg-blue-500 px-3 py-1 rounded"
          >
            {isDark ? "🌙" : "☀️"}
          </button>

          <button
            onClick={onLogout}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
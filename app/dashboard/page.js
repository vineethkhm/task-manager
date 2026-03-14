'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar.js';
import TaskCard from '../../components/TaskCard.js';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending' });
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = window.localStorage.getItem('taskManagerDarkMode');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const initial = stored ? stored === 'true' : prefersDark;
    setDarkMode(initial);
    document.documentElement.classList.toggle('dark', initial);

    checkAuth();
    fetchTasks();
  }, [search, statusFilter, page]);

  const checkAuth = async () => {
    const res = await fetch('/api/auth/check');
    if (!res.ok) router.push('/login');
  };

  const fetchTasks = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, search, status: statusFilter });
    const res = await fetch(`/api/tasks?${params}`);
    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks);
      setTotalPages(data.pagination.pages);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (res.ok) fetchTasks();
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleToggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    window.localStorage.setItem('taskManagerDarkMode', next.toString());
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onLogout={handleLogout} isDark={darkMode} onToggleDark={handleToggleDark} />

      <main className="mx-auto max-w-6xl px-4 py-10">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold dark:text-white">My Tasks</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            + Create Task
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-6">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
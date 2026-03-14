'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar.js';
import TaskCard from '../../components/TaskCard.js';

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date' },
  { value: 'title', label: 'Title' },
  { value: 'status', label: 'Status' },
];

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = window.localStorage.getItem('taskManagerDarkMode');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const initial = stored ? stored === 'true' : prefersDark;
    setDarkMode(initial);
    document.documentElement.classList.toggle('dark', initial);

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchTasks();
  }, [search, statusFilter, page, isAuthenticated]);

  const checkAuth = async () => {
    const res = await fetch('/api/auth/check');
    if (!res.ok) {
      router.push('/login');
      return false;
    }

    setIsAuthenticated(true);
    return true;
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
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

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

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({ title: task.title, description: task.description, status: task.status });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setEditingTask(null);
    setFormData({ title: '', description: '', status: 'pending' });
  };

  const handleSubmit = async () => {
    const url = editingTask ? `/api/tasks/${editingTask._id}` : '/api/tasks';
    const method = editingTask ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setShowCreateForm(false);
      resetForm();
      fetchTasks();
    }
  };

  const sortedTasks = useMemo(() => {
    const copy = [...tasks];
    copy.sort((a, b) => {
      const get = (item) => {
        if (sortBy === 'title') return item.title?.toLowerCase() || '';
        if (sortBy === 'status') return item.status || '';
        return new Date(item.createdAt).getTime();
      };

      const aVal = get(a);
      const bVal = get(b);

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [tasks, sortBy, sortDirection]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 dark:bg-gray-950 dark:text-slate-100">
      <Navbar onLogout={handleLogout} isDark={darkMode} onToggleDark={handleToggleDark} />

      <main className="mx-auto max-w-6xl px-4 py-10 animate-fade-in">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">My Tasks</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Manage your tasks, filter by status, and track progress.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowCreateForm(true);
            }}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.02] hover:shadow-indigo-500/30"
          >
            + Create Task
          </button>
        </header>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                🔍
              </span>
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search tasks..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-gray-800 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-gray-800 dark:text-slate-100"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-gray-800 dark:text-slate-100"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      Sort by {option.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-gray-800 dark:text-slate-100 dark:hover:bg-gray-700"
                >
                  {sortDirection === 'asc' ? 'Asc' : 'Desc'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          {loading ? (
            <div className="py-16 text-center text-slate-500 dark:text-slate-400">Loading tasks...</div>
          ) : sortedTasks.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm dark:bg-gray-900 dark:text-slate-400">
              No tasks found. Create a task to get started.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:bg-gray-700"
            >
              Previous
            </button>

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-gray-800 dark:text-slate-200">
              <span className="text-slate-500 dark:text-slate-400">Page</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900 dark:bg-gray-700 dark:text-white">
                {page}
              </span>
              <span className="text-slate-500 dark:text-slate-400">of</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900 dark:bg-gray-700 dark:text-white">
                {totalPages}
              </span>
            </div>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </section>

        {showCreateForm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10"
            onClick={() => {
              setShowCreateForm(false);
              resetForm();
            }}
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {editingTask ? 'Edit Task' : 'Create Task'}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Close
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="mt-6 space-y-5"
              >
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Title
                  </label>
                  <input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-gray-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-gray-800 dark:text-slate-100"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-gray-800 dark:text-slate-100"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      resetForm();
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:bg-gray-700 sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:w-auto"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

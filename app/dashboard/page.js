'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
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
    const res = await fetch('/api/auth/check', { method: 'GET' });
    if (!res.ok) {
      router.push('/login');
    }
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

  const handleCreate = async () => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setShowCreateForm(false);
      setFormData({ title: '', description: '', status: 'pending' });
      fetchTasks();
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({ title: task.title, description: task.description, status: task.status });
  };

  const handleUpdate = async () => {
    const res = await fetch(`/api/tasks/${editingTask._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'pending' });
      fetchTasks();
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchTasks();
    }
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

  const sortTasks = (items) => {
    const sorted = [...items];
    sorted.sort((a, b) => {
      const getValue = (item) => {
        if (sortBy === 'title') return item.title?.toLowerCase() || '';
        if (sortBy === 'status') return item.status || '';
        return new Date(item.createdAt).getTime();
      };

      const aVal = getValue(a);
      const bVal = getValue(b);

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar onLogout={handleLogout} isDark={darkMode} onToggleDark={handleToggleDark} />
      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-10 animate-fade-in">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
              My Tasks
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Manage your tasks, filter by status, and track progress.
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.02] hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            + Create Task
          </button>
        </div>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 relative">
              <label className="sr-only" htmlFor="search">
                Search tasks
              </label>
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                id="search"
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="flex-1">
                <label className="sr-only" htmlFor="status">
                  Filter by status
                </label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="sr-only" htmlFor="sort">
                  Sort tasks
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="createdAt">Sort by date</option>
                  <option value="title">Sort by title</option>
                  <option value="status">Sort by status</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                {sortDirection === 'asc' ? 'Asc' : 'Desc'}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8">
          {loading ? (
            <div className="py-16 text-center text-slate-500">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
              No tasks found. Create a task to get started.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortTasks(tasks).map((task) => (
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
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Previous
            </button>

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <span className="text-slate-500 dark:text-slate-400">Page</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900 dark:bg-slate-700 dark:text-white">
                {page}
              </span>
              <span className="text-slate-500 dark:text-slate-400">of</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-900 dark:bg-slate-700 dark:text-white">
                {totalPages}
              </span>
            </div>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Next
            </button>
          </div>
        </section>

        {(showCreateForm || editingTask) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl animate-pop-in">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingTask ? 'Edit Task' : 'Create Task'}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingTask(null);
                    setFormData({ title: '', description: '', status: 'pending' });
                  }}
                  className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
                >
                  Close
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  editingTask ? handleUpdate() : handleCreate();
                }}
                className="mt-6 space-y-5"
              >
                <div>
                  <label className="text-sm font-medium text-slate-700">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
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
                      setEditingTask(null);
                      setFormData({ title: '', description: '', status: 'pending' });
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
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
import React from 'react';

const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 5L12 10L7 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TaskCard = ({ task, onEdit, onDelete }) => {
  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-200/20 dark:text-amber-200',
    'in-progress': 'bg-sky-100 text-sky-700 dark:bg-sky-200/20 dark:text-sky-200',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-200/20 dark:text-emerald-200',
  };

  const formattedStatus = task.status
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-900">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-90" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{task.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {task.description || 'No description provided.'}
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusColors[task.status]}`}
          >
            <span className="h-2 w-2 rounded-full bg-current" />
            {formattedStatus}
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-500" />
            <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(task)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:bg-indigo-700"
            >
              Edit
              <ChevronRight />
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:bg-red-700"
            >
              Delete
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

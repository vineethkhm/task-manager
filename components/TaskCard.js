import React from 'react';
import { Pencil, Trash2, Circle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const statusColors = {
    pending: 'bg-amber-100 text-amber-700',
    'in-progress': 'bg-sky-100 text-sky-700',
    completed: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-70" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {task.title}
              </h3>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {task.description || 'No description provided.'}
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusColors[task.status]}`}
          >
            {task.status}
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-500 dark:bg-slate-400" />
            Created {new Date(task.createdAt).toLocaleDateString()}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(task)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition transform hover:scale-[1.02] hover:bg-blue-700"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition transform hover:scale-[1.02] hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
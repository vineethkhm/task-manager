import React from 'react';

const TaskCard = ({ task, onEdit, onDelete }) => {

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

      <h3 className="text-lg font-semibold dark:text-white">
        {task.title}
      </h3>

      <p className="text-gray-600 dark:text-gray-300 mt-2">
        {task.description}
      </p>

      <span className={`inline-block mt-3 px-3 py-1 text-xs rounded ${statusColors[task.status]}`}>
        {task.status}
      </span>

      <div className="flex gap-2 mt-4">

        <button
          onClick={() => onEdit(task)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(task._id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>

      </div>

    </div>
  );
};

export default TaskCard;
import React, { useState } from 'react';
import Task from './Task';

interface NewTaskFormProps {
  onSubmit: (newTask: Partial<Task>) => void;
}

const ProjectForm: React.FC<NewTaskFormProps> = ({ onSubmit }) => {
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'low',
  });

  const addTask = () => {
    onSubmit(newTask);
    setNewTask({
      title: '',
      description: '',
      priority: 'low',
    });
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <h3 className="text-lg font-bold mb-2">New Task</h3>
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="border rounded-md p-2"
        />
        <textarea
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="border rounded-md p-2"
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
          className="border rounded-md p-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={addTask} className="bg-blue-500 text-white py-2 px-4 rounded-md">
          Add Task
        </button>
      </div>
    </div>
  );
};

export default ProjectForm;

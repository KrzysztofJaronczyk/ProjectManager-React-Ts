import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Task from '../shared/Task'; 
import ProjectForm from '../shared/ProjectForm';

const mockTasks: Task[] = [
  { id: '1', title: 'Task 1', description: 'Description 1', priority: 'high', state: 'todo', createdAt: new Date() },
  { id: '2', title: 'Task 2', description: 'Description 2', priority: 'medium', state: 'doing', createdAt: new Date() },
  { id: '3', title: 'Task 3', description: 'Description 3', priority: 'low', state: 'done', createdAt: new Date() },
];

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const addTask = (newTask: Partial<Task>) => {
    const taskWithId = { ...newTask, id: Date.now().toString(), state: 'todo', createdAt: new Date() } as Task;
    setTasks([...tasks, taskWithId]);
  };

  const updateTask = (id: string, updatedData: Partial<Task>) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, ...updatedData } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Project Details - {projectId}</h1>
      <ProjectForm onSubmit={addTask} />

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">ToDo</h2>
        <div className="space-y-2">
          {tasks.filter(task => task.state === 'todo').map(task => (
            <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
          ))}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-6">InProgress</h2>
        <div className="space-y-2">
          {tasks.filter(task => task.state === 'doing').map(task => (
            <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
          ))}
        </div>

        <h2 className="text-xl font-bold mb-2 mt-6">Done</h2>
        <div className="space-y-2">
          {tasks.filter(task => task.state === 'done').map(task => (
            <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, data: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [taskData, setTaskData] = useState<Partial<Task>>(task);

  const handleEditToggle = () => setIsEdit(!isEdit);

  const handleInputChange = (field: keyof Task, value: string) => {
    setTaskData({ ...taskData, [field]: value });
  };

  const handleUpdate = () => {
    onUpdate(task.id, taskData);
    setIsEdit(false);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      {isEdit ? (
        <>
          <input
            type="text"
            value={taskData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="border rounded-md p-2 mb-2 w-full"
          />
          <textarea
            value={taskData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="border rounded-md p-2 mb-2 w-full"
          />
          <select
            value={taskData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="border rounded-md p-2 mb-2 w-full"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button onClick={handleUpdate} className="bg-green-500 text-white py-1 px-3 rounded-md">
              Save
            </button>
            <button onClick={handleEditToggle} className="bg-gray-500 text-white py-1 px-3 rounded-md">
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-bold">{task.title}</h3>
          <p>{task.description}</p>
          <p className="text-sm">Priority: {task.priority}</p>
          <div className="flex justify-end space-x-2 mt-2">
            <button onClick={handleEditToggle} className="bg-blue-500 text-white py-1 px-3 rounded-md">
              Edit
            </button>
            <button onClick={handleDelete} className="bg-red-500 text-white py-1 px-3 rounded-md">
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

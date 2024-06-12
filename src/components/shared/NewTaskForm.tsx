import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useFirestore } from '~/lib/firebase';
import Task from './Task';
import 'react-datepicker/dist/react-datepicker.css';

interface NewTaskFormProps {
  onSubmit: (newTask: Partial<Task>) => void;
  functionalityId: string;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ onSubmit, functionalityId }) => {
  const firestore = useFirestore();
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: '',
    description: '',
    priority: 'low',
    functionalityId,
    expectedCompletionTime: '',
    state: 'todo',
    addDate: new Date(),
    assignedUser: 'developer', // Default user
  });

  const handleInputChange = (field: keyof Task, value: string | Date) => {
    setNewTask({ ...newTask, [field]: value });
  };

  const handleStateChange = (value: 'todo' | 'doing' | 'done') => {
    const updatedTask: Partial<Task> = { ...newTask, state: value };
    if (value === 'doing') {
      updatedTask.startDate = new Date();
    } else if (value === 'done') {
      updatedTask.endDate = new Date();
    }
    setNewTask(updatedTask);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tasksCollection = collection(firestore, 'tasks');
      const docRef = await addDoc(tasksCollection, newTask);
      onSubmit({ ...newTask, id: docRef.id });
      setNewTask({
        name: '',
        description: '',
        priority: 'low',
        functionalityId,
        expectedCompletionTime: '',
        state: 'todo',
        addDate: new Date(),
        assignedUser: 'developer',
      });
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-md">
      <h3 className="text-lg font-bold mb-2">New Task</h3>
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          placeholder="Name"
          value={newTask.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="border rounded-md p-2"
        />
        <textarea
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="border rounded-md p-2"
        />
        <select
          value={newTask.priority}
          onChange={(e) => handleInputChange('priority', e.target.value as 'low' | 'medium' | 'high')}
          className="border rounded-md p-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="text"
          value={newTask.expectedCompletionTime}
          onChange={(e) => handleInputChange('expectedCompletionTime', e.target.value)}
          className="border rounded-md p-2"
          placeholder="Expected Completion Time (in days)"
        />
        <select
          value={newTask.state}
          onChange={(e) => handleStateChange(e.target.value as 'todo' | 'doing' | 'done')}
          className="border rounded-md p-2"
        >
          <option value="todo">To Do</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>
        {(newTask.state === 'doing' || newTask.state === 'done') && (
          <select
            value={newTask.assignedUser}
            onChange={(e) => handleInputChange('assignedUser', e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="developer">Developer</option>
            <option value="devops">DevOps</option>
            <option value="admin">Admin</option>
          </select>
        )}
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
          Add Task
        </button>
      </div>
    </form>
  );
};

export default NewTaskForm;

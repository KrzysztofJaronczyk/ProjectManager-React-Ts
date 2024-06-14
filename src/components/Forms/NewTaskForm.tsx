import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '~/lib/firebase';
import Task from '../Models/Task';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface NewTaskFormProps {
  onSubmit: (newTask: Partial<Task>) => void;
  functionalityId: string;
  initialData?: Partial<Task>;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ onSubmit, functionalityId, initialData }) => {
  const firestore = useFirestore();
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: '',
    description: '',
    priority: 'low',
    functionalityId,
    expectedCompletionTime: '',
    state: 'todo',
    addDate: new Date(),
    assignedUser: 'developer',
  });

  useEffect(() => {
    if (initialData) {
      setNewTask(initialData);
    }
  }, [initialData]);

  const handleInputChange = (field: keyof Task, value: string | Date | null) => {
    setNewTask({ ...newTask, [field]: value ?? '' });
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
      const updatedTask: Partial<Task> = {
        ...newTask,
        endDate: newTask.state !== 'done' ? null : new Date(),
      };
      if (initialData && initialData.id) {
        const taskDoc = doc(firestore, 'tasks', initialData.id);
        await updateDoc(taskDoc, updatedTask);
        onSubmit({ ...updatedTask, id: initialData.id });
      } else {
        const tasksCollection = collection(firestore, 'tasks');
        const docRef = await addDoc(tasksCollection, updatedTask);
        onSubmit({ ...updatedTask, id: docRef.id });
      }
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
          {initialData ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};

export default NewTaskForm;

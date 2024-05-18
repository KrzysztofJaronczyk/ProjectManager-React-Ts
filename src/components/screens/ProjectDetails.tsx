import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, addDoc, doc, updateDoc, deleteDoc, where } from 'firebase/firestore';
import { useFirestore } from '~/lib/firebase';
import Task from '../shared/Task';
import ProjectForm from '../shared/ProjectForm';
import Modal from '../shared/Modal';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QuestionMarkCircleIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// const mockTasks: Task[] = [
//   { id: '1', title: 'Task 1', description: 'Description 1', priority: 'high', state: 'todo', createdAt: new Date() },
//   { id: '2', title: 'Task 2', description: 'Description 2', priority: 'medium', state: 'doing', createdAt: new Date() },
//   { id: '3', title: 'Task 3', description: 'Description 3', priority: 'low', state: 'done', createdAt: new Date() },
// ];

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const firestore = useFirestore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTasks() {
      const tasksCollection = collection(firestore, 'tasks');
      const tasksQuery = query(tasksCollection, where('projectId', '==', projectId));
      const querySnapshot = await getDocs(tasksQuery);
      const fetchedTasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedTasks.push({ id: doc.id, ...data, createdAt: data.createdAt.toDate() } as Task);
      });
      setTasks(fetchedTasks);
    }

    fetchTasks();
  }, [firestore, projectId]);

  const addTask = async (newTask: Partial<Task>) => {
    try {
      const tasksCollection = collection(firestore, 'tasks');
      const taskWithId = { ...newTask, projectId, state: 'todo', createdAt: new Date() } as Task;
      const docRef = await addDoc(tasksCollection, taskWithId);
      setTasks([...tasks, { ...taskWithId, id: docRef.id }]);
      toast.success('Task added!', { transition: Bounce });
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  const updateTask = async (id: string, updatedData: Partial<Task>) => {
    try {
      const docRef = doc(firestore, 'tasks', id);
      await updateDoc(docRef, updatedData);
      setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updatedData } : task)));
      toast.success('Task updated!', { transition: Bounce });
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const docRef = doc(firestore, 'tasks', id);
      await deleteDoc(docRef);
      setTasks(tasks.filter((task) => task.id !== id));
      toast.success('Task deleted!', { transition: Bounce });
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Project Details - {projectId}</h1>
        <button onClick={openModal} className="bg-green-500 text-white py-2 px-4 rounded-md">
          Add Task
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ProjectForm onSubmit={addTask} />
      </Modal>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center justify-center">
            <QuestionMarkCircleIcon className="w-8 h-8 mr-2 text-green-500" /> Todo
          </h2>
          {tasks
            .filter((task) => task.state === 'todo')
            .map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
            ))}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center justify-center">
            <ExclamationCircleIcon className="w-8 h-8 mr-2 text-yellow-500" /> In Progress
          </h2>
          {tasks
            .filter((task) => task.state === 'doing')
            .map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
            ))}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center justify-center">
            <CheckCircleIcon className="w-8 h-8 mr-2 text-purple-500" /> Done
          </h2>{' '}
          {tasks
            .filter((task) => task.state === 'done')
            .map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
            ))}
        </div>
      </div>

      <ToastContainer />
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

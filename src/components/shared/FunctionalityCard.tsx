import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useFirestore } from '~/lib/firebase';
import Functionality from './Functionality';
import Modal from './Modal';
import NewTaskForm from './NewTaskForm';
import Task from './Task';
import { PencilSquareIcon, TrashIcon, UserPlusIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

interface FunctionalityCardProps {
  functionality: Functionality;
  onUpdate: (id: string, data: Partial<Functionality>) => void;
  onDelete: (id: string) => void;
}

const FunctionalityCard: React.FC<FunctionalityCardProps> = ({ functionality, onUpdate, onDelete }) => {
  const firestore = useFirestore();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [functionalityData, setFunctionalityData] = useState<Partial<Functionality>>(functionality);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskEditModalOpen, setIsTaskEditModalOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Partial<Task> | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksCollection = collection(firestore, 'tasks');
      const q = query(tasksCollection, where('functionalityId', '==', functionality.id));
      const querySnapshot = await getDocs(q);
      const tasksList: Task[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Task;
        return {
          ...data,
          id: doc.id,
          addDate: (data.addDate as any).toDate(),
          startDate: data.startDate ? (data.startDate as any).toDate() : undefined,
          endDate: data.endDate ? (data.endDate as any).toDate() : undefined,
        };
      });
      setTasks(tasksList);
    };

    fetchTasks();
  }, [firestore, functionality.id]);

  const handleEditToggle = () => setIsEdit(!isEdit);

  const handleInputChange = (field: keyof Functionality, value: string) => {
    setFunctionalityData({ ...functionalityData, [field]: value });
  };

  const handleUpdate = () => {
    onUpdate(functionality.id, functionalityData);
    setIsEdit(false);
  };

  const handleDelete = () => {
    onDelete(functionality.id);
  };

  const openTaskModal = () => setIsTaskModalOpen(true);
  const closeTaskModal = () => setIsTaskModalOpen(false);

  const addTask = (newTask: Partial<Task>) => {
    setTasks((prevTasks) => [...prevTasks, newTask as Task]);
    closeTaskModal();
  };

  const openTaskEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskEditModalOpen(true);
  };
  const closeTaskEditModal = () => setIsTaskEditModalOpen(false);

  const updateTask = async (updatedTask: Partial<Task>) => {
    if (updatedTask.id) {
      const taskDoc = doc(firestore, 'tasks', updatedTask.id);
      await updateDoc(taskDoc, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task)),
      );
      closeTaskEditModal();
    }
  };

  const deleteTask = async (taskId: string) => {
    const taskDoc = doc(firestore, 'tasks', taskId);
    await deleteDoc(taskDoc);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const assignUser = async (task: Task) => {
    // Add logic to assign a user to the task
    console.log('Assign user to task:', task);
  };

  const renderTaskState = (state: 'todo' | 'doing' | 'done') => {
    switch (state) {
      case 'todo':
        return <span className="text-green-500">{state}</span>;
      case 'doing':
        return <span className="text-orange-500">{state}</span>;
      case 'done':
        return <span className="text-purple-500">{state}</span>;
      default:
        return state;
    }
  };

  const calculateEndDate = (addDate: Date, days: string) => {
    const endDate = new Date(addDate);
    endDate.setDate(endDate.getDate() + parseInt(days, 10));
    return endDate;
  };

  function getShadowColorClass(priority: string) {
    switch (priority) {
      case 'low':
        return 'shadow-gray-400';
      case 'medium':
        return 'shadow-orange-400';
      case 'high':
        return 'shadow-red-400';
      default:
        return '';
    }
  }

  return (
    <div className={`bg-white p-4 rounded-md shadow-md ${getShadowColorClass(functionality.priority)}`}>
      {isEdit ? (
        <>
          <h3 className="text-lg font-bold">Functionality</h3>
          <input
            type="text"
            value={functionalityData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="border rounded-md p-2 mb-2 w-full"
          />
          <h3 className="text-lg font-bold">Description</h3>
          <textarea
            value={functionalityData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="border rounded-md p-2 mb-2 w-full"
          />
          <h3 className="text-lg font-bold">Priority</h3>
          <select
            value={functionalityData.priority}
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
          <h3 className="text-lg font-bold">Functionality: {functionality.title}</h3>
          <p>{functionality.description}</p>
          <p className="text-md">Priority: {functionality.priority}</p>
          <h3 className="text-lg font-bold mt-3">Tasks</h3>
          <div className="mt-2 space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="bg-gray-100 p-2 rounded-md relative group">
                <div>
                  <h4 className="font-bold">{task.name}</h4>
                  <p>{task.description}</p>
                  <p className="text-sm">Priority: {task.priority}</p>
                  <p className="text-sm">State: {renderTaskState(task.state)}</p>
                  <p className="text-sm">Assigned User: {task.assignedUser}</p>
                  {task.startDate && <p className="text-sm">Start Date: {task.startDate.toDateString()}</p>}
                  {task.endDate && <p className="text-sm">End Date: {task.endDate.toDateString()}</p>}
                  <p className="text-sm">
                    Expected Completion Time: {task.expectedCompletionTime} days
                    {task.startDate &&
                      ` - should be done till ${calculateEndDate(task.addDate, task.expectedCompletionTime).toDateString()}`}
                  </p>
                </div>
                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => assignUser(task)} className="text-gray-500">
                    <UserPlusIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => openTaskEditModal(task)} className="text-blue-500">
                    <PencilSquareIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="text-red-500">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 flex space-x-2">
                  {task.state === 'done' && (
                    <div className="flex space-x-2 justify-center items-center">
                      <CheckBadgeIcon className="w-5 h-5 text-purple-500" />
                      <p className="text-purple-500">Completed</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-2 mt-2">
            <button onClick={openTaskModal} className="bg-green-500 text-white py-1 px-3 rounded-md">
              Add Task
            </button>
            <button onClick={handleEditToggle} className="bg-blue-500 text-white py-1 px-3 rounded-md">
              Edit
            </button>
            <button onClick={handleDelete} className="bg-red-500 text-white py-1 px-3 rounded-md">
              Delete
            </button>
          </div>
          <Modal isOpen={isTaskModalOpen} onClose={closeTaskModal}>
            <NewTaskForm onSubmit={addTask} functionalityId={functionality.id} />
          </Modal>
          <Modal isOpen={isTaskEditModalOpen} onClose={closeTaskEditModal}>
            {taskToEdit && (
              <NewTaskForm onSubmit={updateTask} functionalityId={functionality.id} initialData={taskToEdit} />
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default FunctionalityCard;

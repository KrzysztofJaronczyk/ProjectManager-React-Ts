import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirestore } from '~/lib/firebase';
import Functionality from './Functionality';
import Modal from './Modal';
import NewTaskForm from './NewTaskForm';
import Task from './Task';

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

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksCollection = collection(firestore, 'tasks');
      const q = query(tasksCollection, where('functionalityId', '==', functionality.id));
      const querySnapshot = await getDocs(q);
      const tasksList: Task[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
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

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      {isEdit ? (
        <>
          <input
            type="text"
            value={functionalityData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="border rounded-md p-2 mb-2 w-full"
          />
          <textarea
            value={functionalityData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="border rounded-md p-2 mb-2 w-full"
          />
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
          <h3 className="text-lg font-bold">{functionality.title}</h3>
          <p>{functionality.description}</p>
          <p className="text-sm">Priority: {functionality.priority}</p>
          <h3 className="text-lg font-bold mt-3">Tasks</h3>
          <div className="mt-2 space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="bg-gray-100 p-2 rounded-md">
                <h4 className="font-bold">{task.name}</h4>
                <p>{task.description}</p>
                <p className="text-sm">Priority: {task.priority}</p>
                <p className="text-sm">State: {task.state}</p>
                <p className="text-sm">Assigned User: {task.assignedUser}</p>
                {task.startDate && <p className="text-sm">Start Date: {task.startDate.toDateString()}</p>}
                {task.endDate && <p className="text-sm">End Date: {task.endDate.toDateString()}</p>}
                <p className="text-sm">Expected Completion Time: {task.expectedCompletionTime}</p>
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
        </>
      )}
    </div>
  );
};

export default FunctionalityCard;

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
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import TaskCard from '../shared/TaskCard';
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

  const updateTask = async (id: string, updatedData: Partial<Omit<Task, 'id'>>) => {
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

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
  
    const { source, destination } = result;
  
    if (source.droppableId === destination.droppableId) {
      // Reorder within the same column
      const updatedTasks = Array.from(tasks);
      const [removed] = updatedTasks.splice(source.index, 1);
      updatedTasks.splice(destination.index, 0, removed);
      setTasks(updatedTasks);
    } else {
      // Move to a different column
      const sourceTask = tasks.find((task) => task.id === result.draggableId);
      if (sourceTask) {
        const updatedTask = { ...sourceTask, state: destination.droppableId as 'todo' | 'doing' | 'done' };
        updateTask(result.draggableId, updatedTask);
      }
      const updatedTasks = tasks.filter((task) => task.id !== result.draggableId);
      setTasks(updatedTasks);
    }
  };
  
  

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

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4">
          <Droppable droppableId="todo">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <h2 className="text-xl font-bold mb-2 flex items-center justify-center">
                  <QuestionMarkCircleIcon className="w-8 h-8 mr-2 text-green-500" /> Todo
                </h2>
                {tasks
                  .filter((task) => task.state === 'todo')
                  .map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                          <TaskCard task={task} onUpdate={updateTask} onDelete={deleteTask} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="doing">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <h2 className="text-xl font-bold mb-2 flex items-center justify-center">
                  <ExclamationCircleIcon className="w-8 h-8 mr-2 text-yellow-500" /> In Progress
                </h2>
                {tasks
                  .filter((task) => task.state === 'doing')
                  .map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                          <TaskCard task={task} onUpdate={updateTask} onDelete={deleteTask} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="done">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <h2 className="text-xl font-bold mb-2 flex items-center justify-center">
                  <CheckCircleIcon className="w-8 h-8 mr-2 text-purple-500" /> Done
                </h2>
                {tasks
                  .filter((task) => task.state === 'done')
                  .map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                          <TaskCard task={task} onUpdate={updateTask} onDelete={deleteTask} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      <ToastContainer />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, addDoc, doc, updateDoc, deleteDoc, where } from 'firebase/firestore';
import { useFirestore } from '~/lib/firebase';
import Functionality from '../Models/Functionality';
import NewFunctionalityForm from '../Forms/NewFunctionalityForm';
import Modal from '../Forms/Modal';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import FunctionalityCard from './FunctionalityCard';
import { showToast } from '../ToastMessage/ToastMessage';
import ToastMessage from '../ToastMessage/ToastMessage';
import { QuestionMarkCircleIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const firestore = useFirestore();
  const [functionalities, setFunctionalities] = useState<Functionality[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchFunctionalities() {
      const functionalitiesCollection = collection(firestore, 'functionalities');
      const functionalitiesQuery = query(functionalitiesCollection, where('projectId', '==', projectId));
      const querySnapshot = await getDocs(functionalitiesQuery);
      const fetchedFunctionalities: Functionality[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedFunctionalities.push({ id: doc.id, ...data, createdAt: data.createdAt.toDate() } as Functionality);
      });
      setFunctionalities(fetchedFunctionalities);
    }

    fetchFunctionalities();
  }, [firestore, projectId]);

  const addFunctionality = async (newFunctionality: Partial<Functionality>) => {
    try {
      const functionalitiesCollection = collection(firestore, 'functionalities');
      const functionalityWithId = {
        ...newFunctionality,
        projectId,
        state: 'todo',
        createdAt: new Date(),
      } as Functionality;
      const docRef = await addDoc(functionalitiesCollection, functionalityWithId);
      setFunctionalities([...functionalities, { ...functionalityWithId, id: docRef.id }]);
      showToast('Functionality added!', 'success');
    } catch (error) {
      console.error('Error adding functionality: ', error);
      showToast('Error adding functionality!', 'error');
    }
  };

  const updateFunctionality = async (id: string, updatedData: Partial<Omit<Functionality, 'id'>>) => {
    try {
      const docRef = doc(firestore, 'functionalities', id);
      await updateDoc(docRef, updatedData);
      setFunctionalities(
        functionalities.map((functionality) =>
          functionality.id === id ? { ...functionality, ...updatedData } : functionality,
        ),
      );
      showToast('Functionality updated!', 'success');
    } catch (error) {
      console.error('Error updating functionality: ', error);
      showToast('Error updating functionality!', 'error');
    }
  };

  const deleteFunctionality = async (id: string) => {
    try {
      const docRef = doc(firestore, 'functionalities', id);
      await deleteDoc(docRef);
      setFunctionalities(functionalities.filter((functionality) => functionality.id !== id));
      showToast('Functionality deleted!', 'success');
    } catch (error) {
      console.error('Error deleting functionality: ', error);
      showToast('Error deleting functionality!', 'error');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // Reorder within the same column
      const updatedFunctionalities = Array.from(functionalities);
      const [removed] = updatedFunctionalities.splice(source.index, 1);
      updatedFunctionalities.splice(destination.index, 0, removed);
      setFunctionalities(updatedFunctionalities);
    } else {
      // Move to a different column
      const sourceFunctionality = functionalities.find((functionality) => functionality.id === result.draggableId);
      if (sourceFunctionality) {
        const updatedFunctionality = {
          ...sourceFunctionality,
          state: destination.droppableId as 'todo' | 'doing' | 'done',
        };
        updateFunctionality(result.draggableId, updatedFunctionality);
      }
      const updatedFunctionalities = functionalities.filter((functionality) => functionality.id !== result.draggableId);
      setFunctionalities(updatedFunctionalities);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Project Details - {projectId}</h1>
        <button onClick={openModal} className="bg-green-500 text-white py-2 px-4 rounded-md">
          Add Functionality
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <NewFunctionalityForm onSubmit={addFunctionality} />
      </Modal>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4 ">
          <Droppable droppableId="todo">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <h2 className="text-xl font-bold mb-2 flex items-center justify-center">
                  <QuestionMarkCircleIcon className="w-8 h-8 mr-2 text-green-500" /> Todo
                </h2>
                {functionalities
                  .filter((functionality) => functionality.state === 'todo')
                  .map((functionality, index) => (
                    <Draggable key={functionality.id} draggableId={functionality.id} index={index}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="my-2"
                        >
                          <FunctionalityCard
                            functionality={functionality}
                            onUpdate={updateFunctionality}
                            onDelete={deleteFunctionality}
                          />
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
                {functionalities
                  .filter((functionality) => functionality.state === 'doing')
                  .map((functionality, index) => (
                    <Draggable key={functionality.id} draggableId={functionality.id} index={index}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="my-2"
                        >
                          <FunctionalityCard
                            functionality={functionality}
                            onUpdate={updateFunctionality}
                            onDelete={deleteFunctionality}
                          />
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
                {functionalities
                  .filter((functionality) => functionality.state === 'done')
                  .map((functionality, index) => (
                    <Draggable key={functionality.id} draggableId={functionality.id} index={index}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className="my-2"
                        >
                          <FunctionalityCard
                            functionality={functionality}
                            onUpdate={updateFunctionality}
                            onDelete={deleteFunctionality}
                          />
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

      <ToastMessage />
    </div>
  );
}

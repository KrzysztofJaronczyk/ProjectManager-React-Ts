import { useContext, useState } from 'react';
import Functionality from './Functionality';
import ModalContext from '../contexts/ModalContext';
import ProjectForm from './ProjectForm';
import Modal from './Modal';

interface FunctionalityCardProps {
  functionality: Functionality;
  onUpdate: (id: string, data: Partial<Functionality>) => void;
  onDelete: (id: string) => void;
}

const FunctionalityCard: React.FC<FunctionalityCardProps> = ({ functionality, onUpdate, onDelete }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [functionalityData, setFunctionalityData] = useState<Partial<Functionality>>(functionality);

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

  const { isOpen, onClose, onOpen } = useContext(ModalContext);

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
          <div className="flex justify-end space-x-2 mt-2">
            <button onClick={onOpen} className="bg-green-500 text-white py-1 px-3 rounded-md">
              Add Task
            </button>
            <button onClick={handleEditToggle} className="bg-blue-500 text-white py-1 px-3 rounded-md">
              Edit
            </button>
            <button onClick={handleDelete} className="bg-red-500 text-white py-1 px-3 rounded-md">
              Delete
            </button>
          </div>
          {/* <Modal isOpen={isOpen} onClose={onClose}>
              <ProjectForm onSubmit={} />
            </Modal> */}
        </>
      )}
    </div>
  );
};

export default FunctionalityCard;

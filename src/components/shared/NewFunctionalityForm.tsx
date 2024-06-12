import React, { useState } from 'react';
import Functionality from './Functionality';

interface NewFunctionalityFormProps {
  onSubmit: (newFunctionality: Partial<Functionality>) => void;
}

const NewFunctionalityForm: React.FC<NewFunctionalityFormProps> = ({ onSubmit }) => {
  const [newFunctionality, setNewFunctionality] = useState<Partial<Functionality>>({
    title: '',
    description: '',
    priority: 'low',
  });

  const addFunctionality = () => {
    onSubmit(newFunctionality);
    setNewFunctionality({
      title: '',
      description: '',
      priority: 'low',
    });
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <h3 className="text-lg font-bold mb-2">New Functionality</h3>
      <div className="flex flex-col space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={newFunctionality.title}
          onChange={(e) => setNewFunctionality({ ...newFunctionality, title: e.target.value })}
          className="border rounded-md p-2"
        />
        <textarea
          placeholder="Description"
          value={newFunctionality.description}
          onChange={(e) => setNewFunctionality({ ...newFunctionality, description: e.target.value })}
          className="border rounded-md p-2"
        />
        <h3 className="text-lg font-bold mb-2">Priority</h3>
        <select
          value={newFunctionality.priority}
          onChange={(e) =>
            setNewFunctionality({ ...newFunctionality, priority: e.target.value as 'low' | 'medium' | 'high' })
          }
          className="border rounded-md p-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={addFunctionality} className="bg-blue-500 text-white py-2 px-4 rounded-md">
          Add Functionality
        </button>
      </div>
    </div>
  );
};

export default NewFunctionalityForm;

import { useContext, useState } from "react";
import Task from "./Task";
import ModalContext from "../contexts/ModalContext";
import ProjectForm from "./ProjectForm";
import Modal from "./Modal";

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
  
    const { isOpen, onClose, onOpen } = useContext(ModalContext);
  
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
  

  export default TaskCard;
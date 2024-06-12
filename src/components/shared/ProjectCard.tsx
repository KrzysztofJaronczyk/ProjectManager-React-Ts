import { Project, InputEnum } from '../screens/Index';
import {
  PencilSquareIcon,
  CheckIcon,
  XCircleIcon,
  TrashIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  onUpdate: (id: string, data: Partial<Project>) => void;
  onDelete: (id: string) => void;
}

const ProjectCard = ({ project, onUpdate, onDelete }: ProjectCardProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [inputData, setInputData] = useState<Partial<Project>>(project);

  const toggleIsEdit = () => setIsEdit(prevIsEdit => !prevIsEdit);

  const onClose = () => {
    setIsEdit(false);
    setInputData(project);
  };

  const handleInputChange = (field: InputEnum, value: string) => {
    setInputData({ ...inputData, [field]: value });
  };

  const handleUpdate = () => {
    setIsEdit(false);
    onUpdate(project.id, inputData);
  };

  const handleDelete = () => {
    onDelete(project.id);
  };

  const inputClasses = clsx(
    'text-slate-50',
    'bg-transparent',
    'border',
    'border-slate-700',
    'focus:ring-slate-400',
    'focus:outline-none',
    'p-4',
    'rounded-lg',
    'w-full'
  );

  const showDetails = () => {
    // Redirect to project details page with project ID
    window.location.href = `/project/${project.id}`;
  };

  return (
    <div key={project.id} className="h-48 group relative rounded-md flex flex-col justify-between shadow-slate-900 shadow-md p-4 bg-gradient-to-r from-slate-800 to-slate-700">
      <div>
        {isEdit ? (
          <input
            className={clsx(inputClasses, 'text-xl mb-2 font-bold', {
              'bg-gray-900': isEdit,
              'cursor-text': isEdit
            })}
            value={inputData.title}
            onChange={(e) => handleInputChange(InputEnum.Title, e.target.value)}
          />
        ) : (
          <div className="text-xl mb-2 font-bold">Project: {inputData.title}</div>
        )}
        {isEdit ? (
          <input
            className={clsx(inputClasses, {
              'bg-gray-900': isEdit,
              'cursor-text': isEdit
            })}
            value={inputData.desc}
            onChange={(e) => handleInputChange(InputEnum.Description, e.target.value)}
          />
        ) : (
          <div>{inputData.desc}</div>
        )}
      </div>
      <div className="text-slate-200 text-right">{inputData.created?.toLocaleDateString()}</div>
      {isEdit ? (
        <>
          <CheckIcon onClick={handleUpdate} className="h-6 w-6 text-green-500 absolute top-4 right-12 cursor-pointer" />
          <XCircleIcon onClick={onClose} className="h-6 w-6 text-red-900 absolute top-4 right-4 cursor-pointer" />
        </>
      ) : (
        <button className="btn btn-active btn-ghost hidden group-hover:block absolute top-4 right-4 p-0 h-20">
          <InformationCircleIcon
            onClick={showDetails}
            className="h-6 w-6 top-0 right-0 absolute text-slate-50 cursor-pointer"
          />

          <PencilSquareIcon
            onClick={toggleIsEdit}
            className="h-6 w-6 top-0 right-0 absolute top-10 text-slate-50 cursor-pointer"
          />
          <TrashIcon onClick={handleDelete} className="h-6 w-6 text-red-900 absolute top-20 right-0 cursor-pointer" />
        </button>
      )}
    </div>
  );
};

export default ProjectCard;

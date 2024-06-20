import React, { useState, useEffect } from 'react';
import { InputEnum } from './Index';
import {
  PencilSquareIcon,
  CheckIcon,
  XCircleIcon,
  TrashIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { showToast } from '../ToastMessage/ToastMessage';
import Project from '../Models/Project';
import clsx from 'clsx';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirestore } from '~/lib/firebase';
import Functionality from '../Models/Functionality';

interface ProjectCardProps {
  project: Project;
  onUpdate: (id: string, data: Partial<Project>) => void;
  onDelete: (id: string) => void;
}

const ProjectCard = ({ project, onUpdate, onDelete }: ProjectCardProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [inputData, setInputData] = useState<Partial<Project>>(project);
  const [functionalitiesCount, setFunctionalitiesCount] = useState<number>(0);
  const firestore = useFirestore();

  useEffect(() => {
    async function fetchFunctionalities() {
      const functionalitiesQuery = query(
        collection(firestore, 'functionalities'),
        where('projectId', '==', project.id),
      );
      const functionalitiesSnapshot = await getDocs(functionalitiesQuery);
      const functionalitiesData = functionalitiesSnapshot.docs.map((doc) => doc.data() as Functionality);
      setFunctionalitiesCount(functionalitiesData.length);
    }

    fetchFunctionalities();
  }, [firestore, project.id]);

  const toggleIsEdit = () => setIsEdit((prevIsEdit) => !prevIsEdit);

  const onClose = () => {
    setIsEdit(false);
    setInputData(project);
  };

  const handleInputChange = (field: InputEnum, value: string) => {
    setInputData({ ...inputData, [field]: value });
  };

  const validateProject = (data: Partial<Project>) => {
    if (!data.title || !data.desc || !data.created) {
      return 'All fields are required.';
    }
    return null;
  };

  const handleUpdate = () => {
    const error = validateProject(inputData);
    if (error) {
      showToast('⚠️ ' + error, 'error');
      return; // Prevent the update if validation fails
    }
    setIsEdit(false);
    onUpdate(project.id, inputData);
  };

  const handleDelete = () => {
    onDelete(project.id);
  };

  const showDetails = () => {
    window.location.href = `/project/${project.id}`;
  };
  const cardBgColor = 'bg-base-300';
  const textColor = 'text-base-content';

  return (
    <div
      key={project.id}
      className={clsx(
        'h-48 group relative rounded-md flex flex-col justify-between shadow-sm p-4',
        cardBgColor,
        textColor,
      )}
    >
      <div>
        {isEdit ? (
          <input
            className={clsx('text-xl mb-2 font-bold w-full px-2 py-1 rounded-md', cardBgColor, textColor)}
            value={inputData.title}
            onChange={(e) => handleInputChange(InputEnum.Title, e.target.value)}
          />
        ) : (
          <div className="text-xl mb-2 font-bold">{inputData.title}</div>
        )}
        {isEdit ? (
          <textarea
            className={clsx('w-full px-2 py-1 rounded-md', cardBgColor, textColor)}
            value={inputData.desc}
            onChange={(e) => handleInputChange(InputEnum.Description, e.target.value)}
            style={{ resize: 'none' }}
          />
        ) : (
          <div className="overflow-hidden">{inputData.desc}</div>
        )}
        <div className="mt-2">
          <span className="font-semibold">Project functionalities: </span>
          <span>{functionalitiesCount}</span>
        </div>
        <div></div>
      </div>
      <div className="text-xs text-right">{inputData.created?.toLocaleDateString()}</div>
      {isEdit ? (
        <>
          <CheckIcon onClick={handleUpdate} className="h-6 w-6 absolute top-4 right-12 cursor-pointer" />
          <XCircleIcon onClick={onClose} className="h-6 w-6 absolute top-4 right-4 cursor-pointer" />
        </>
      ) : (
        <button className="hidden group-hover:block absolute top-4 right-4 p-0 h-20">
          <InformationCircleIcon onClick={showDetails} className="h-6 w-6 absolute top-0 right-0 cursor-pointer" />
          <PencilSquareIcon onClick={toggleIsEdit} className="h-6 w-6 absolute top-10 right-0 cursor-pointer" />
          <TrashIcon onClick={handleDelete} className="h-6 w-6 absolute top-20 right-0 cursor-pointer" />
        </button>
      )}
    </div>
  );
};

export default ProjectCard;

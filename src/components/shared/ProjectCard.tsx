import { Project } from '../screens/Index';
import { PencilSquareIcon, CheckIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const toggleEdit = () => setIsEdit((prevIsEdit) => !prevIsEdit);

  return (
    <div
      key={project.id}
      className="h-40 group relative rounded-md flex flex-col justify-between shadow-slate-900 shadow-md p-4 bg-gradient-to-r from-slate-800 to-slate-700"
    >
      <div>
        <div className="text-xl mb-2 font-bold">Project: {project.title}</div>
        <div className="font-xl">{project.desc}</div>
      </div>
      <div className="text-slate-200 text-right text-md text-opacity-60 font-semibold">
        {project.created ? project.created.toDateString() : 'No date'}

        {isEdit ? (
          <>
            <CheckIcon className="h-6 w-6 text-green-500 absolute top-4 right-4 cursor-pointer" />
            <XCircleIcon className="h-6 w-6 text-red-400 absolute top-4 right-12 cursor-pointer" />
          </>
        ) : (
          <button className='btn btn-active btn-ghost' onClick={toggleEdit}>
            <PencilSquareIcon className="h-6 w-6 text-slate-200 hidden group-hover:block absolute top-4 right-4 cursor-pointer" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

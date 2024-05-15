import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useFirestore } from '~/lib/firebase';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ProjectCard from '../shared/ProjectCard';

export type Project = {
  id: string;
  title: string;
  desc: string;
  created: Date | null;
};

export enum InputEnum {
  Id = 'id',
  Title = 'title',
  Description = 'desc',
  Created = 'created',
}

function Index() {
  const [projects, setProjects] = useState<Array<Project>>([]);
  const firestore = useFirestore();
  const [inputData, setInputData] = useState<Partial<Project>>({
    title: '',
    desc: '',
    created: new Date(),
  });
  const [formError, setFormError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const projectsCollection = collection(firestore, 'project');
      const projectsQuery = query(projectsCollection);
      const querySnapshot = await getDocs(projectsQuery);
      const fetchedData: Array<Project> = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.created) {
          // Check if created field exists
          const createdDate = data.created.toDate(); // Parse Firestore Timestamp to Date object
          fetchedData.push({ id: doc.id, ...data, created: createdDate } as Project);
        } else {
          fetchedData.push({ id: doc.id, ...data, created: null } as Project); // If created field is missing, set to null
        }
      });
      setProjects(fetchedData);
    }
    fetchData();
  }, []);

  const onDeleteProject = async (id: string) => {
    try {
      const docRef = doc(firestore, 'project', id);
      await deleteDoc(docRef);
      setProjects(projects.filter(project => project.id !== id));
      toast.success('🗑️ Project has been deleted!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdateProject = (id: string, data: Partial<Project>) => {
    const docRef = doc(firestore, 'project', id);
    updateDoc(docRef, data).then(() => {
      toast.success('🦄 Project has been updated!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
    })
    .catch(error => {
      console.log(error);
    });
  };

  const handleInputChange = (field: InputEnum, value: string | Date | null) => {
    setInputData({
      ...inputData,
      [field]: value || new Date(), // If null, set to current date
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const projectsCollection = collection(firestore, 'project');
      const newProject: Partial<Project> = {
        title: inputData.title,
        desc: inputData.desc,
        created: inputData.created as Date,
      };

      const docRef = await addDoc(projectsCollection, newProject);
      toast.success('🦄 Project has been added!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
      setProjects([...projects, { id: docRef.id, ...newProject } as Project]);
      setInputData({ title: '', desc: '', created: new Date() });
    } catch (error) {
      setFormError(true);
    }
  };

  return (
    <>
      <div className="hero min-h-screen bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <form className="flex items-center" onSubmit={handleFormSubmit}>
            <input
              type="text"
              onChange={(e) => handleInputChange(InputEnum.Title, e.target.value)}
              value={inputData.title}
              placeholder="title"
              className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
            />
            <input
              type="text"
              onChange={(e) => handleInputChange(InputEnum.Description, e.target.value)}
              value={inputData.desc}
              placeholder="description"
              className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
            />
            <DatePicker
              selected={inputData.created as Date}
              onChange={(date) => handleInputChange(InputEnum.Created, date)}
              dateFormat="dd/MM/yyyy" // Set date format to DD/MM/YYYY
              className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
            />
            <button
              type="submit"
              className="m-4 border border-purple-500 p-3 rounded-lg transition-opacity bg-purple-600 bg-opacity-30 hover:bg-opacity-50 text-slate-50"
            >
              Add new project
            </button>
          </form>
          <div className="grid grid-cols-3 gap-4 w-full text-slate-50">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onUpdate={onUpdateProject} onDelete={onDeleteProject} />
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Index;
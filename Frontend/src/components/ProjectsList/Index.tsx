import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useFirestore } from '~/lib/firebase';
import { showToast } from '../ToastMessage/ToastMessage';
import ToastMessage from '../ToastMessage/ToastMessage';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ProjectCard from './ProjectCard';
import Project from '../Models/Project';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';

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
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const projectsCollection = collection(firestore, 'project');
      const projectsQuery = query(projectsCollection);
      const querySnapshot = await getDocs(projectsQuery);
      const fetchedData: Array<Project> = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.created) {
          const createdDate = data.created.toDate(); // Parse Firestore Timestamp to Date object
          fetchedData.push({ id: doc.id, ...data, created: createdDate } as Project);
        } else {
          fetchedData.push({ id: doc.id, ...data, created: null } as Project); // If created field is missing, set to null
        }
      });
      setProjects(fetchedData);
    }
    fetchData();
  }, [firestore]);

  const onDeleteProject = async (id: string) => {
    try {
      const docRef = doc(firestore, 'project', id);
      await deleteDoc(docRef);
      setProjects(projects.filter((project) => project.id !== id));
      showToast('🗑️ Project has been deleted!', 'success');
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdateProject = (id: string, data: Partial<Project>) => {
    const docRef = doc(firestore, 'project', id);
    updateDoc(docRef, data)
      .then(() => {
        showToast('🦄 Project has been updated!', 'success');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleInputChange = (field: InputEnum, value: string | Date | null) => {
    setInputData({
      ...inputData,
      [field]: value || new Date(), // If null, set to current date
    });
  };

  const validateForm = () => {
    if (!inputData.title || !inputData.desc || !inputData.created) {
      return 'All fields are required.';
    }
    return null;
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setFormError(error);
      showToast('⚠️ ' + error, 'error');
      return;
    }
    try {
      const projectsCollection = collection(firestore, 'project');
      const newProject: Partial<Project> = {
        title: inputData.title,
        desc: inputData.desc,
        created: inputData.created as Date,
      };

      const docRef = await addDoc(projectsCollection, newProject);
      showToast('🦄 Project has been added!', 'success');
      setProjects([...projects, { id: docRef.id, ...newProject } as Project]);
      setInputData({ title: '', desc: '', created: new Date() });
      setFormError(null);
    } catch (error) {
      setFormError('An error occurred while adding the project.');
      showToast('⚠️ An error occurred while adding the project.', 'error');
    }
  };

  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="max-w-5xl mx-auto py-8">
        <ThemeSwitcher /> {/* ThemeSwitcher component for theme selection */}
        <form className="flex items-center space-x-4 mb-4" onSubmit={handleFormSubmit}>
          <input
            type="text"
            onChange={(e) => handleInputChange(InputEnum.Title, e.target.value)}
            value={inputData.title}
            placeholder="Title"
            className="input input-bordered w-1/4"
          />
          <input
            type="text"
            onChange={(e) => handleInputChange(InputEnum.Description, e.target.value)}
            value={inputData.desc}
            placeholder="Description"
            className="input input-bordered w-1/2"
          />
          <DatePicker
            selected={inputData.created as Date}
            onChange={(date) => handleInputChange(InputEnum.Created, date)}
            dateFormat="dd/MM/yyyy"
            className="input input-bordered"
          />
          <button
            type="submit"
            className="btn btn-primary"
          >
            Add Project
          </button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onUpdate={onUpdateProject}
              onDelete={onDeleteProject}
            />
          ))}
        </div>
      </div>
      <ToastMessage />
    </div>
  );
}

export default Index;

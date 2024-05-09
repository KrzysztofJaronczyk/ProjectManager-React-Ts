import React from 'react';
import { Dialog } from '@headlessui/react';
import { collection, getDocs, query, addDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useAuthState } from '~/components/contexts/UserContext';
import { SignInButton } from '~/components/domain/auth/SignInButton';
import { SignOutButton } from '~/components/domain/auth/SignOutButton';
import { Head } from '~/components/shared/Head';
import { useFirestore, useStorage } from '~/lib/firebase';

export type Project = {
  id: string;
  title: string;
  desc: string;
};

enum InputEnum {
  Id = 'id',
  Title = 'title',
  Description = 'desc',
}

function Index() {
  const { state } = useAuthState();
  const [projects, setprojects] = useState<Array<Project>>([]);
  const firestore = useFirestore();
  const storage = useStorage();
  const [inputData, setInputData] = useState<Partial<Project>>({
    title: '',
    desc: '',
  });
  const [image, setImage] = useState('');
  const [formError, setFormError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const projectsCollection = collection(firestore, 'project');
      const projectsQuery = query(projectsCollection);
      const querySnapshot = await getDocs(projectsQuery);
      const fetchedData: Array<Project> = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data() } as Project);
      });
      // console.log(fetchedData);

      setprojects(fetchedData);
    }
    fetchData();
  }, []);

  const handleInputChange = (field: InputEnum, value: string) => {
    setInputData({
      ...inputData,
      [field]: value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //don't reload the page
    e.preventDefault();
    //>>project crud operations<<
    //ADD new project
    try{
     const projectsCollection = collection(firestore, 'project');
      const newProject: Partial<Project> = {
        title: inputData.title,
        desc: inputData.desc,
      };
      // console.log(newProject);
      await addDoc(projectsCollection, newProject);
      //update the state
      setprojects([...projects, newProject as Project]);
      setInputData({ title: '', desc: '' });
    } catch (error) {
     setFormError(true);
    }
  };

  return (
    <>
      <Head title="TOP PAGE" />
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
              placeholder='description'
              className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
            />
            <button
              type="submit"
              className="m-4 border border-purple-500 p-3 rounded-lg transition-opacity bg-purple-600 bg-opacity-30 hover:bg-opacity-50 text-slate-50"
            >
              Add new project
            </button>
          </form>
          <table className="table w-full text-slate-50">
            <thead>
              <tr>
                <th className="bg-slate-900 border border-slate-700 text-slate-50 uppercase">Title</th>
                <th className="bg-slate-900 border border-slate-700 text-slate-50 uppercase">Description</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="bg-transparent">
                  <td className="border border-slate-700">{project.title}</td>
                  <td className="border border-slate-700">{project.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Index;

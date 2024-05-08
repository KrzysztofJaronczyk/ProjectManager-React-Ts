import { Dialog } from '@headlessui/react';
import { collection, getDocs, query } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { useAuthState } from '~/components/contexts/UserContext';
import { SignInButton } from '~/components/domain/auth/SignInButton';
import { SignOutButton } from '~/components/domain/auth/SignOutButton';
import { Head } from '~/components/shared/Head';
import { useFirestore, useStorage } from '~/lib/firebase';

export type Tool = {
  id: string;
  title: string;
  desc: string;
};

function Index() {
  const { state } = useAuthState();
  const [projects, setprojects] = useState<Array<Tool>>([]);
  const firestore = useFirestore();
  const storage = useStorage();
  const [inputData, setInputData] = useState<Partial<Tool>>({
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
      const fetchedData: Array<Tool> = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data() } as Tool);
      });
      // console.log(fetchedData);

      setprojects(fetchedData);
    }
    fetchData();
  }, []);

  return (
    <>
      <Head title="TOP PAGE" />
      <div className="hero min-h-screen">
        {/* display projects */}
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center">Projects</h1>
          <div className="grid grid-cols-3 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white p-4 shadow-md rounded-md">
                <h2 className="text-lg font-bold">{project.title}</h2>
                <p>{project.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;

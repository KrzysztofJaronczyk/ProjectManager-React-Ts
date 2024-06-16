interface Functionality {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    state: 'todo' | 'doing' | 'done';
    createdAt?: Date;
  }
  
  export default Functionality;
  
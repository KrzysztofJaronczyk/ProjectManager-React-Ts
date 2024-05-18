interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    state: 'todo' | 'doing' | 'done';
    createdAt?: Date;
  }
  
  export default Task;
  
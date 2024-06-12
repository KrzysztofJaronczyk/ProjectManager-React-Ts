interface Task {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  functionalityId: string;
  expectedCompletionTime: string;
  state: 'todo' | 'doing' | 'done';
  addDate: Date;
  startDate?: Date;
  endDate?: Date;
  assignedUser?: string;
}

export default Task;

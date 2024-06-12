interface Task {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  functionalityId: string;
  expectedCompletionTime: string;
  state: 'todo' | 'doing' | 'done';
  addDate: Date;
  startDate?: Date | null;
  endDate?: Date | null;
  assignedUser?: string | 'none';
}

export default Task;

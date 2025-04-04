export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskCategory = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  priority: TaskPriority;
  categoryId: string;
};
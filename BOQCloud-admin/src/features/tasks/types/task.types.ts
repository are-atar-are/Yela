export interface Task {
  userId: string;
  taskId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  assignedTo?: string;
}

export interface TaskInput {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  tags?: string[];
  assignedTo?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags?: string[];
  assignedTo?: string;
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  searchQuery?: string;
}

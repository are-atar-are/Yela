import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Task, TaskInput, TaskUpdate } from '../types/task.types';
import { taskService } from '../services/taskService';

interface TasksState {
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string | null;
    priority: string | null;
    searchQuery: string;
  };
}

const initialState: TasksState = {
  tasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,
  filters: {
    status: null,
    priority: null,
    searchQuery: '',
  },
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId: string, { rejectWithValue }) => {
    try {
      const tasks = await taskService.getTasks(userId);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (
    { userId, taskInput }: { userId: string; taskInput: TaskInput },
    { rejectWithValue }
  ) => {
    try {
      const task = await taskService.createTask(userId, taskInput);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (
    {
      userId,
      taskId,
      updates,
    }: { userId: string; taskId: string; updates: TaskUpdate },
    { rejectWithValue }
  ) => {
    try {
      const task = await taskService.updateTask(userId, taskId, updates);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (
    { userId, taskId }: { userId: string; taskId: string },
    { rejectWithValue }
  ) => {
    try {
      await taskService.deleteTask(userId, taskId);
      return taskId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete task');
    }
  }
);

export const toggleTaskStatus = createAsyncThunk(
  'tasks/toggleTaskStatus',
  async (
    {
      userId,
      taskId,
      currentStatus,
    }: { userId: string; taskId: string; currentStatus: string },
    { rejectWithValue }
  ) => {
    try {
      const task = await taskService.toggleTaskStatus(userId, taskId, currentStatus);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle task status');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        status: null,
        priority: null,
        searchQuery: '',
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder.addCase(fetchTasks.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tasks = action.payload;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create task
    builder.addCase(createTask.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createTask.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tasks.unshift(action.payload);
    });
    builder.addCase(createTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update task
    builder.addCase(updateTask.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.tasks.findIndex((t) => t.taskId === action.payload.taskId);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      if (state.selectedTask?.taskId === action.payload.taskId) {
        state.selectedTask = action.payload;
      }
    });
    builder.addCase(updateTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete task
    builder.addCase(deleteTask.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.isLoading = false;
      state.tasks = state.tasks.filter((t) => t.taskId !== action.payload);
      if (state.selectedTask?.taskId === action.payload) {
        state.selectedTask = null;
      }
    });
    builder.addCase(deleteTask.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Toggle task status
    builder.addCase(toggleTaskStatus.fulfilled, (state, action) => {
      const index = state.tasks.findIndex((t) => t.taskId === action.payload.taskId);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      if (state.selectedTask?.taskId === action.payload.taskId) {
        state.selectedTask = action.payload;
      }
    });
  },
});

export const {
  setSelectedTask,
  clearSelectedTask,
  setFilters,
  clearFilters,
  clearError,
} = tasksSlice.actions;

export default tasksSlice.reducer;

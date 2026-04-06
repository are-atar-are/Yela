import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../components/layout/Layout';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  setSelectedTask,
  clearSelectedTask,
  setFilters,
} from '../store/tasksSlice';
import type { TaskInput, TaskUpdate } from '../types/task.types';
import './TaskList.css';

const TaskList: React.FC = () => {
  const dispatch = useDispatch();
  const { tasks, selectedTask, isLoading, error, filters } = useSelector(
    (state: any) => state.tasks
  );
  const { user } = useSelector((state: any) => state.auth);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<TaskInput>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    tags: [],
  });

  // Fetch tasks on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTasks(user.id) as any);
    }
  }, [dispatch, user?.id]);

  // Filter tasks
  const filteredTasks = tasks.filter((task: any) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Sort by due date
  const sortedTasks = [...filteredTasks].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const handleCreate = () => {
    setIsEditing(false);
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      tags: [],
    });
    setIsModalOpen(true);
  };

  const handleEdit = (task: any) => {
    setIsEditing(true);
    dispatch(setSelectedTask(task));
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate.split('T')[0],
      tags: task.tags || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask({ userId: user.id, taskId }) as any);
    }
  };

  const handleToggleStatus = (task: any) => {
    dispatch(
      toggleTaskStatus({
        userId: user.id,
        taskId: task.taskId,
        currentStatus: task.status,
      }) as any
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedTask) {
      const updates: TaskUpdate = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate,
        tags: formData.tags,
      };
      dispatch(
        updateTask({
          userId: user.id,
          taskId: selectedTask.taskId,
          updates,
        }) as any
      );
    } else {
      dispatch(createTask({ userId: user.id, taskInput: formData }) as any);
    }
    setIsModalOpen(false);
    dispatch(clearSelectedTask());
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in-progress':
        return '#3b82f6';
      case 'pending':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  return (
    <Layout title="Task List">
      <div className="task-list-container">
        {/* Header */}
        <div className="task-list-header">
          <h1>Tasks</h1>
          <button className="btn-primary" onClick={handleCreate}>
            + New Task
          </button>
        </div>

        {/* Error */}
        {error && <div className="error-message">{error}</div>}

        {/* Filters */}
        <div className="task-filters">
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.searchQuery}
            onChange={(e) =>
              dispatch(setFilters({ searchQuery: e.target.value }))
            }
            className="search-input"
          />
          <select
            value={filters.status || ''}
            onChange={(e) =>
              dispatch(setFilters({ status: e.target.value || null }))
            }
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filters.priority || ''}
            onChange={(e) =>
              dispatch(setFilters({ priority: e.target.value || null }))
            }
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Loading */}
        {isLoading && <div className="loading">Loading tasks...</div>}

        {/* Task List */}
        <div className="task-list">
          {sortedTasks.length === 0 && !isLoading && (
            <div className="empty-state">
              <p>No tasks found. Create your first task!</p>
            </div>
          )}

          {sortedTasks.map((task: any) => (
            <div
              key={task.taskId}
              className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}
            >
              <div className="task-checkbox">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => handleToggleStatus(task)}
                />
              </div>
              <div className="task-content">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className="task-meta">
                  <span
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  >
                    {task.priority}
                  </span>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(task.status) }}
                  >
                    {task.status}
                  </span>
                  <span className="due-date">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="task-actions">
                <button
                  className="btn-icon"
                  onClick={() => handleEdit(task)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className="btn-icon"
                  onClick={() => handleDelete(task.taskId)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{isEditing ? 'Edit Task' : 'New Task'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as any,
                        })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          priority: e.target.value as any,
                        })
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setIsModalOpen(false);
                      dispatch(clearSelectedTask());
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {isEditing ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TaskList;

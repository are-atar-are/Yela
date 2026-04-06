import React from 'react';
import Layout from '../../../components/layout/Layout';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './Projects.css';

const Projects: React.FC = () => {
  const statusData = [
    { name: 'In Progress', value: 8, color: '#3b82f6' },
    { name: 'Completed', value: 12, color: '#10b981' },
    { name: 'On Hold', value: 3, color: '#f59e0b' },
    { name: 'Planning', value: 5, color: '#8b5cf6' },
  ];

  const projects = [
    { id: 1, name: 'Sound Construction Service', client: 'Michael Walker', status: 'In Progress', progress: 75, budget: '$45,000', spent: '$33,750', dueDate: 'Apr 15, 2026' },
    { id: 2, name: 'Ravensdale Kitchen Remodel', client: 'Sarah Johnson', status: 'In Progress', progress: 45, budget: '$28,000', spent: '$12,600', dueDate: 'May 1, 2026' },
    { id: 3, name: 'Bathroom Renovation', client: 'Emily Davis', status: 'Completed', progress: 100, budget: '$15,000', spent: '$14,200', dueDate: 'Mar 10, 2026' },
    { id: 4, name: 'Deck Construction', client: 'Robert Wilson', status: 'Planning', progress: 10, budget: '$22,000', spent: '$2,200', dueDate: 'Jun 15, 2026' },
    { id: 5, name: 'Basement Finish', client: 'Jennifer Lee', status: 'On Hold', progress: 30, budget: '$35,000', spent: '$10,500', dueDate: 'Jul 1, 2026' },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'In Progress': '#3b82f6',
      'Completed': '#10b981',
      'On Hold': '#f59e0b',
      'Planning': '#8b5cf6',
    };
    return colors[status] || '#666';
  };

  return (
    <Layout title="Projects">
      <div className="projects">
        {/* Stats */}
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-label">Total Projects</div>
            <div className="stat-value">28</div>
            <div className="stat-subtext">+3 this month</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">In Progress</div>
            <div className="stat-value">8</div>
            <div className="stat-subtext">Active now</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Completed</div>
            <div className="stat-value">12</div>
            <div className="stat-subtext">This year</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Total Budget</div>
            <div className="stat-value">$1.2M</div>
            <div className="stat-subtext">Across all projects</div>
          </div>
        </div>

        <div className="two-column">
          {/* Projects List */}
          <div className="card projects-list">
            <div className="card-header">
              <h3>Active Projects</h3>
              <button className="btn-primary">+ New Project</button>
            </div>
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-header">
                    <h4>{project.name}</h4>
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: `${getStatusColor(project.status)}20`, color: getStatusColor(project.status) }}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="project-client">{project.client}</div>
                  <div className="project-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${project.progress}%`, backgroundColor: getStatusColor(project.status) }}
                      />
                    </div>
                    <span className="progress-text">{project.progress}%</span>
                  </div>
                  <div className="project-footer">
                    <div className="budget-info">
                      <span className="budget-label">Budget</span>
                      <span className="budget-value">{project.budget}</span>
                    </div>
                    <div className="due-date">
                      <span className="date-label">Due</span>
                      <span className="date-value">{project.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Chart */}
          <div className="card chart-card">
            <div className="card-header">
              <h3>Project Status</h3>
            </div>
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="status-legend">
              {statusData.map((item) => (
                <div key={item.name} className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: item.color }} />
                  <span className="legend-label">{item.name}</span>
                  <span className="legend-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Projects;

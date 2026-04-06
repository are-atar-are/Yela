import React from 'react';
import Layout from '../../../components/layout/Layout';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <Layout title="Dashboard">
      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon blue">📊</div>
              <span className="stat-trend positive">+12%</span>
            </div>
            <div className="stat-value">24</div>
            <div className="stat-label">Total Projects</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon green">📅</div>
              <span className="stat-trend positive">+8%</span>
            </div>
            <div className="stat-value">18</div>
            <div className="stat-label">Active Estimates</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon purple">💰</div>
              <span className="stat-trend positive">+23%</span>
            </div>
            <div className="stat-value">$45,230</div>
            <div className="stat-label">Revenue (Month)</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon orange">⏳</div>
              <span className="stat-trend negative">-2%</span>
            </div>
            <div className="stat-value">7</div>
            <div className="stat-label">Pending Tasks</div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="btn-secondary">View All</button>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-content">
                <div className="activity-title">New estimate created</div>
                <div className="activity-meta">Estimate #21-00220011-15 • 2 hours ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <div className="activity-title">Project marked complete</div>
                <div className="activity-meta">Sound Construction Service • 5 hours ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">💬</div>
              <div className="activity-content">
                <div className="activity-title">New message from client</div>
                <div className="activity-meta">Michael Walker • 1 day ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

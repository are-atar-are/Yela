import React from 'react';
import Layout from '../../../components/layout/Layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './TimeTracking.css';

const TimeTracking: React.FC = () => {
  const weeklyData = [
    { day: 'Mon', hours: 8.5 },
    { day: 'Tue', hours: 7.2 },
    { day: 'Wed', hours: 9.0 },
    { day: 'Thu', hours: 8.0 },
    { day: 'Fri', hours: 6.5 },
    { day: 'Sat', hours: 4.0 },
    { day: 'Sun', hours: 0 },
  ];

  const activeTimers = [
    { id: 1, employee: 'John Smith', project: 'Sound Construction', task: 'Demolition', startTime: '08:00 AM', duration: '2h 34m' },
    { id: 2, employee: 'Sarah Johnson', project: 'Ravensdale Build', task: 'Plumbing', startTime: '09:15 AM', duration: '1h 45m' },
    { id: 3, employee: 'Mike Brown', project: 'Kitchen Remodel', task: 'Electrical', startTime: '07:30 AM', duration: '3h 12m' },
  ];

  const recentEntries = [
    { id: 1, date: 'Mar 21, 2026', employee: 'John Smith', project: 'Sound Construction', hours: 8.5, billable: true },
    { id: 2, date: 'Mar 21, 2026', employee: 'Sarah Johnson', project: 'Ravensdale Build', hours: 7.2, billable: true },
    { id: 3, date: 'Mar 20, 2026', employee: 'Mike Brown', project: 'Kitchen Remodel', hours: 9.0, billable: false },
    { id: 4, date: 'Mar 20, 2026', employee: 'Emily Davis', project: 'Bathroom Renovation', hours: 6.5, billable: true },
  ];

  return (
    <Layout title="Time Tracking">
      <div className="time-tracking">
        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-label">Today</div>
            <div className="stat-value">24.5 hrs</div>
            <div className="stat-subtext">Across 8 employees</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">This Week</div>
            <div className="stat-value">156.3 hrs</div>
            <div className="stat-subtext">Billable: 142.5 hrs</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Active Timers</div>
            <div className="stat-value">3</div>
            <div className="stat-subtext">Currently tracking</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">Unbilled Hours</div>
            <div className="stat-value">47.2 hrs</div>
            <div className="stat-subtext">Pending invoicing</div>
          </div>
        </div>

        {/* Weekly Hours Chart */}
        <div className="card">
          <div className="card-header">
            <h3>Weekly Hours Overview</h3>
            <select className="select-input">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="hours" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Timers */}
        <div className="card">
          <div className="card-header">
            <h3>Active Timers</h3>
            <button className="btn-primary">Start Timer</button>
          </div>
          <div className="timers-list">
            {activeTimers.map((timer) => (
              <div key={timer.id} className="timer-item">
                <div className="timer-info">
                  <div className="timer-employee">{timer.employee}</div>
                  <div className="timer-project">{timer.project} • {timer.task}</div>
                </div>
                <div className="timer-meta">
                  <div className="timer-start">Started {timer.startTime}</div>
                  <div className="timer-duration">{timer.duration}</div>
                </div>
                <button className="btn-stop">Stop</button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Time Entries */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Time Entries</h3>
            <button className="btn-secondary">View All</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Project</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{entry.employee}</td>
                  <td>{entry.project}</td>
                  <td>{entry.hours}</td>
                  <td>
                    <span className={`badge ${entry.billable ? 'billable' : 'non-billable'}`}>
                      {entry.billable ? 'Billable' : 'Non-Billable'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default TimeTracking;

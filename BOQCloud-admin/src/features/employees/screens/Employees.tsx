import React, { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { cognitoService, CognitoUser } from '../../../services/cognitoService';
import './Employees.css';

interface Employee extends CognitoUser {}

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    role: 'employee' as 'admin' | 'manager' | 'employee',
    status: 'active' as 'active' | 'inactive' | 'pending',
  });

  // Load users from Cognito
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      if (cognitoService.isConfigured()) {
        const users = await cognitoService.listUsers();
        setEmployees(users);
      } else {
        // Fallback to mock data if Cognito not configured
        setEmployees([
          {
            userId: 'demo-001',
            username: 'demo',
            email: 'demo@fleeto.com',
            name: 'Demo User (Cognito Not Configured)',
            status: 'active',
            role: 'admin',
            createdAt: new Date().toISOString(),
            enabled: true,
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      alert('Failed to load employees. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      username: '',
      role: 'employee',
      status: 'active',
    });
    setShowAddModal(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      username: employee.username,
      role: employee.role,
      status: employee.status,
    });
    setShowAddModal(true);
  };

  const handleSaveEmployee = async () => {
    try {
      if (editingEmployee) {
        // Update existing user in Cognito
        await cognitoService.updateUser(editingEmployee.username, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        });
        
        // Update local state
        setEmployees(employees.map(emp => 
          emp.userId === editingEmployee.userId 
            ? { ...emp, ...formData }
            : emp
        ));
      } else {
        // Create new user in Cognito - use email as username
        const newUser = await cognitoService.createUser({
          name: formData.name,
          email: formData.email,
          username: formData.email, // Use email as username for Cognito
          role: formData.role,
        });
        
        setEmployees([...employees, newUser]);
        alert(`User created successfully! They will receive an email with temporary password at ${formData.email}`);
      }
      setShowAddModal(false);
    } catch (error: any) {
      console.error('Error saving employee:', error);
      alert(`Failed to save employee: ${error.message}`);
    }
  };

  const handleToggleStatus = async (userId: string, username: string, currentStatus: string) => {
    try {
      const enable = currentStatus === 'inactive';
      await cognitoService.toggleUserStatus(username, enable);
      
      setEmployees(employees.map(emp => {
        if (emp.userId === userId) {
          return { 
            ...emp, 
            status: enable ? 'active' : 'inactive',
            enabled: enable
          };
        }
        return emp;
      }));
    } catch (error: any) {
      console.error('Error toggling status:', error);
      alert(`Failed to update status: ${error.message}`);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusClass = `status-badge ${status}`;
    return <span className={statusClass}>{status}</span>;
  };

  const getRoleBadge = (role: string) => {
    const roleClass = `role-badge ${role}`;
    return <span className={roleClass}>{role}</span>;
  };

  return (
    <Layout title="Employees">
      <div className="employees-page">
        {/* Header Actions */}
        <div className="page-actions">
          <div className="search-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={handleAddEmployee}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Employee
          </button>
        </div>

        {/* Cognito Setup Notice */}
        <div className="info-banner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <div>
            <strong>Mobile App Login:</strong> Users created here can login on the mobile app. 
            If you see "USER_PASSWORD_AUTH flow not enabled" error on mobile, 
            <a 
              href="https://eu-north-1.console.aws.amazon.com/cognito/v2/idp/user-pools/eu-north-1_v8P404noM/app-integration/app-clients" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              enable USER_PASSWORD_AUTH in Cognito App Client settings →
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{employees.length}</div>
            <div className="stat-label">Total Employees</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{employees.filter(e => e.status === 'active').length}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{employees.filter(e => e.status === 'pending').length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{employees.filter(e => e.status === 'inactive').length}</div>
            <div className="stat-label">Inactive</div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="data-card">
          <div className="card-header">
            <h3>Employee List</h3>
          </div>
          
          {loading ? (
            <div className="loading">Loading employees...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.userId}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {employee.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{employee.name}</span>
                      </div>
                    </td>
                    <td>{employee.email}</td>
                    <td>{employee.username}</td>
                    <td>{getRoleBadge(employee.role)}</td>
                    <td>{getStatusBadge(employee.status)}</td>
                    <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon"
                          onClick={() => handleEditEmployee(employee)}
                          title="Edit"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button 
                          className={`btn-icon ${employee.status === 'active' ? 'deactivate' : 'activate'}`}
                          onClick={() => handleToggleStatus(employee.userId, employee.username, employee.status)}
                          title={employee.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {employee.status === 'active' ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
                              <line x1="12" y1="2" x2="12" y2="12"/>
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14"/>
                              <path d="M12 5v14"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
                <button className="btn-close" onClick={() => setShowAddModal(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email (will be used as username)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value, username: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
                {!editingEmployee && (
                  <div className="form-info">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    <span>The employee will receive an email to set their password and complete signup on the mobile app.</span>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSaveEmployee}>
                  {editingEmployee ? 'Save Changes' : 'Add Employee'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Employees;

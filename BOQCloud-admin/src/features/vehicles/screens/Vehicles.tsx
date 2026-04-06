import React, { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { dynamoDBService, Vehicle } from '../../../services/dynamoDBService';
import './Vehicles.css';

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'bakkie' as 'bakkie' | 'hatch' | 'sedan' | 'suv' | 'other',
    photoUrl: '',
    isActive: true,
    defaultAvailableStartTime: '08:00',
    defaultAvailableEndTime: '18:00',
    availableDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    minimumBookingHours: 1,
    maximumBookingDays: 1,
  });

  const daysOfWeek = [
    { key: 'mon', label: 'Mon' },
    { key: 'tue', label: 'Tue' },
    { key: 'wed', label: 'Wed' },
    { key: 'thu', label: 'Thu' },
    { key: 'fri', label: 'Fri' },
    { key: 'sat', label: 'Sat' },
    { key: 'sun', label: 'Sun' },
  ];

  // Load vehicles from DynamoDB
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      if (dynamoDBService.isConfigured()) {
        const data = await dynamoDBService.getAllVehicles();
        setVehicles(data);
      } else {
        // Fallback to demo data
        setVehicles([
          {
            vehicleId: 'demo-001',
            name: 'Demo Vehicle (DynamoDB Not Configured)',
            description: 'Please check your AWS credentials',
            category: 'bakkie',
            photoUrl: 'https://images.unsplash.com/photo-1551830820-330a71b99659?w=800',
            isActive: true,
            defaultAvailableStartTime: '08:00',
            defaultAvailableEndTime: '18:00',
            availableDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
            minimumBookingHours: 1,
            maximumBookingDays: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
      alert('Failed to load vehicles. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setFormData({
      name: '',
      description: '',
      category: 'bakkie',
      photoUrl: '',
      isActive: true,
      defaultAvailableStartTime: '08:00',
      defaultAvailableEndTime: '18:00',
      availableDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
      minimumBookingHours: 1,
      maximumBookingDays: 1,
    });
    setShowAddModal(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      description: vehicle.description,
      category: vehicle.category,
      photoUrl: vehicle.photoUrl,
      isActive: vehicle.isActive,
      defaultAvailableStartTime: vehicle.defaultAvailableStartTime,
      defaultAvailableEndTime: vehicle.defaultAvailableEndTime,
      availableDays: vehicle.availableDays,
      minimumBookingHours: vehicle.minimumBookingHours,
      maximumBookingDays: vehicle.maximumBookingDays,
    });
    setShowAddModal(true);
  };

  const handleSaveVehicle = async () => {
    try {
      if (editingVehicle) {
        // Update existing vehicle in DynamoDB
        const updated = await dynamoDBService.updateVehicle(editingVehicle.vehicleId, formData);
        setVehicles(vehicles.map(v => 
          v.vehicleId === editingVehicle.vehicleId ? updated : v
        ));
      } else {
        // Create new vehicle in DynamoDB
        const newVehicle = await dynamoDBService.createVehicle(formData);
        setVehicles([...vehicles, newVehicle]);
      }
      setShowAddModal(false);
    } catch (error: any) {
      console.error('Error saving vehicle:', error);
      alert(`Failed to save vehicle: ${error.message}`);
    }
  };

  const handleToggleStatus = async (vehicleId: string, currentStatus: boolean) => {
    try {
      const updated = await dynamoDBService.toggleVehicleStatus(vehicleId, currentStatus);
      setVehicles(vehicles.map(v => 
        v.vehicleId === vehicleId ? updated : v
      ));
    } catch (error: any) {
      console.error('Error toggling status:', error);
      alert(`Failed to update status: ${error.message}`);
    }
  };

  const toggleDay = (day: string) => {
    if (formData.availableDays.includes(day)) {
      setFormData({
        ...formData,
        availableDays: formData.availableDays.filter(d => d !== day)
      });
    } else {
      setFormData({
        ...formData,
        availableDays: [...formData.availableDays, day]
      });
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         v.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || v.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      bakkie: 'Bakkie',
      hatch: 'Hatchback',
      sedan: 'Sedan',
      suv: 'SUV',
      other: 'Other',
    };
    return labels[category] || category;
  };

  return (
    <Layout title="Vehicles">
      <div className="vehicles-page">
        {/* Header Actions */}
        <div className="page-actions">
          <div className="filters">
            <div className="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="bakkie">Bakkie</option>
              <option value="hatch">Hatchback</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button className="btn-primary" onClick={handleAddVehicle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Vehicle
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{vehicles.length}</div>
            <div className="stat-label">Total Vehicles</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{vehicles.filter(v => v.isActive).length}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{vehicles.filter(v => !v.isActive).length}</div>
            <div className="stat-label">Inactive</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{vehicles.filter(v => v.category === 'bakkie').length}</div>
            <div className="stat-label">Bakkies</div>
          </div>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="loading">Loading vehicles...</div>
        ) : (
          <div className="vehicles-grid">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.vehicleId} className={`vehicle-card ${!vehicle.isActive ? 'inactive' : ''}`}>
                <div className="vehicle-image">
                  <img src={vehicle.photoUrl} alt={vehicle.name} />
                  <div className={`status-indicator ${vehicle.isActive ? 'active' : 'inactive'}`}>
                    {vehicle.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div className="vehicle-content">
                  <div className="vehicle-header">
                    <h3>{vehicle.name}</h3>
                    <span className="category-badge">{getCategoryLabel(vehicle.category)}</span>
                  </div>
                  <p className="vehicle-description">{vehicle.description}</p>
                  
                  <div className="vehicle-details">
                    <div className="detail-item">
                      <span className="detail-label">Available</span>
                      <span className="detail-value">{vehicle.defaultAvailableStartTime} - {vehicle.defaultAvailableEndTime}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Min Booking</span>
                      <span className="detail-value">{vehicle.minimumBookingHours} hour(s)</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Max Booking</span>
                      <span className="detail-value">{vehicle.maximumBookingDays} day(s)</span>
                    </div>
                  </div>

                  <div className="available-days">
                    {daysOfWeek.map((day) => (
                      <span 
                        key={day.key}
                        className={`day-badge ${vehicle.availableDays.includes(day.key) ? 'active' : ''}`}
                      >
                        {day.label}
                      </span>
                    ))}
                  </div>

                  <div className="vehicle-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => handleEditVehicle(vehicle)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </button>
                    <button 
                      className={`btn-toggle ${vehicle.isActive ? 'deactivate' : 'activate'}`}
                      onClick={() => handleToggleStatus(vehicle.vehicleId, vehicle.isActive)}
                    >
                      {vehicle.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal modal-large">
              <div className="modal-header">
                <h3>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                <button className="btn-close" onClick={() => setShowAddModal(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Vehicle Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Toyota Hilux"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    >
                      <option value="bakkie">Bakkie</option>
                      <option value="hatch">Hatchback</option>
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the vehicle..."
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label>Photo URL</label>
                  <input
                    type="text"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                <div className="form-section">
                  <h4>Availability Settings</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Start Time</label>
                      <input
                        type="time"
                        value={formData.defaultAvailableStartTime}
                        onChange={(e) => setFormData({ ...formData, defaultAvailableStartTime: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>End Time</label>
                      <input
                        type="time"
                        value={formData.defaultAvailableEndTime}
                        onChange={(e) => setFormData({ ...formData, defaultAvailableEndTime: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Min Hours</label>
                      <input
                        type="number"
                        min={1}
                        value={formData.minimumBookingHours}
                        onChange={(e) => setFormData({ ...formData, minimumBookingHours: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Max Days</label>
                      <input
                        type="number"
                        min={1}
                        value={formData.maximumBookingDays}
                        onChange={(e) => setFormData({ ...formData, maximumBookingDays: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Available Days</h4>
                  <div className="days-selector">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day.key}
                        type="button"
                        className={`day-btn ${formData.availableDays.includes(day.key) ? 'active' : ''}`}
                        onClick={() => toggleDay(day.key)}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span>Vehicle is active and available for booking</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSaveVehicle}>
                  {editingVehicle ? 'Save Changes' : 'Add Vehicle'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Vehicles;

import React, { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { dynamoDBService, Booking } from '../../../services/dynamoDBService';
import './Bookings.css';

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Load bookings from DynamoDB
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      if (dynamoDBService.isConfigured()) {
        const data = await dynamoDBService.getAllBookings();
        // Enrich with vehicle names (in production, you'd join with vehicles table)
        setBookings(data.map(b => ({
          ...b,
          userName: b.userId, // Placeholder - would lookup from Cognito
          vehicleName: b.vehicleId, // Placeholder - would lookup from vehicles
        })));
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      alert('Failed to load bookings. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowViewModal(true);
  };

  const handleUpdateStatus = async (vehicleId: string, bookingId: string, newStatus: Booking['status']) => {
    try {
      await dynamoDBService.updateBookingStatus(vehicleId, bookingId, newStatus);
      setBookings(bookings.map(b => 
        b.bookingId === bookingId ? { ...b, status: newStatus } : b
      ));
      if (selectedBooking?.bookingId === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      alert(`Failed to update status: ${error.message}`);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      (b.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.vehicleName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusClasses: Record<string, string> = {
      pending: 'status-badge pending',
      confirmed: 'status-badge confirmed',
      cancelled: 'status-badge cancelled',
      completed: 'status-badge completed',
    };
    return <span className={statusClasses[status]}>{status}</span>;
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  // Group bookings by date for the calendar view
  const groupedBookings = filteredBookings.reduce((acc, booking) => {
    const date = booking.startDateTime.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(booking);
    return acc;
  }, {} as Record<string, Booking[]>);

  return (
    <Layout title="Bookings">
      <div className="bookings-page">
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
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{bookings.length}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{bookings.filter(b => b.status === 'pending').length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{bookings.filter(b => b.status === 'confirmed').length}</div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{bookings.filter(b => b.status === 'completed').length}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="data-card">
          <div className="card-header">
            <h3>All Bookings</h3>
          </div>
          
          {loading ? (
            <div className="loading">Loading bookings...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>User</th>
                  <th>Vehicle</th>
                  <th>Date & Time</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td className="booking-id">#{booking.bookingId.split('-')[1]}</td>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {(booking.userName || '?').charAt(0).toUpperCase()}
                        </div>
                        <span>{booking.userName || booking.userId}</span>
                      </div>
                    </td>
                    <td>{booking.vehicleName || booking.vehicleId}</td>
                    <td>
                      <div className="datetime">
                        <div>{formatDateTime(booking.startDateTime)}</div>
                        <div className="datetime-end">to {formatDateTime(booking.endDateTime)}</div>
                      </div>
                    </td>
                    <td>{getDuration(booking.startDateTime, booking.endDateTime)}</td>
                    <td>{getStatusBadge(booking.status)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon"
                          onClick={() => handleViewBooking(booking)}
                          title="View Details"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        {booking.status === 'pending' && (
                          <button 
                            className="btn-icon confirm"
                            onClick={() => handleUpdateStatus(booking.vehicleId, booking.bookingId, 'confirmed')}
                            title="Confirm"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </button>
                        )}
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button 
                            className="btn-icon cancel"
                            onClick={() => handleUpdateStatus(booking.vehicleId, booking.bookingId, 'cancelled')}
                            title="Cancel"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18"/>
                              <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* View Booking Modal */}
        {showViewModal && selectedBooking && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Booking Details</h3>
                <button className="btn-close" onClick={() => setShowViewModal(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="modal-body">
                <div className="booking-detail-section">
                  <h4>Status</h4>
                  <div className="booking-status">
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                </div>

                <div className="booking-detail-section">
                  <h4>User Information</h4>
                  <div className="detail-row">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedBooking.userName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">User ID:</span>
                    <span className="detail-value">{selectedBooking.userId}</span>
                  </div>
                </div>

                <div className="booking-detail-section">
                  <h4>Vehicle Information</h4>
                  <div className="detail-row">
                    <span className="detail-label">Vehicle:</span>
                    <span className="detail-value">{selectedBooking.vehicleName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Vehicle ID:</span>
                    <span className="detail-value">{selectedBooking.vehicleId}</span>
                  </div>
                </div>

                <div className="booking-detail-section">
                  <h4>Booking Schedule</h4>
                  <div className="detail-row">
                    <span className="detail-label">Start:</span>
                    <span className="detail-value">{formatDateTime(selectedBooking.startDateTime)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">End:</span>
                    <span className="detail-value">{formatDateTime(selectedBooking.endDateTime)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{getDuration(selectedBooking.startDateTime, selectedBooking.endDateTime)}</span>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="booking-detail-section">
                    <h4>Notes</h4>
                    <p className="booking-notes">{selectedBooking.notes}</p>
                  </div>
                )}

                <div className="booking-detail-section">
                  <h4>Booking Metadata</h4>
                  <div className="detail-row">
                    <span className="detail-label">Booking ID:</span>
                    <span className="detail-value">{selectedBooking.bookingId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Created:</span>
                    <span className="detail-value">{formatDateTime(selectedBooking.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {selectedBooking.status === 'pending' && (
                  <>
                    <button 
                      className="btn-secondary"
                      onClick={() => {
                        handleUpdateStatus(selectedBooking.vehicleId, selectedBooking.bookingId, 'cancelled');
                        setShowViewModal(false);
                      }}
                    >
                      Cancel Booking
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => {
                        handleUpdateStatus(selectedBooking.vehicleId, selectedBooking.bookingId, 'confirmed');
                        setShowViewModal(false);
                      }}
                    >
                      Confirm Booking
                    </button>
                  </>
                )}
                {selectedBooking.status !== 'pending' && (
                  <button className="btn-secondary" onClick={() => setShowViewModal(false)}>
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Bookings;

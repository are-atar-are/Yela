import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../../themes/index';
import Header from '../../../components/layout/Header';

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.background};
`;

const MainContent = styled.main`
  padding: ${theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${theme.spacing.md};
`;

const PageTitle = styled.h1`
  font-size: ${theme.typography.h2};
  font-weight: ${theme.typography.bold};
  color: ${theme.colors.textPrimary};
  margin: 0;
  font-family: ${theme.typography.fontFamily};
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  width: 280px;
  transition: all 0.2s ease;
  
  &:focus-within {
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 2px rgba(232, 255, 0, 0.1);
  }
  
  svg {
    width: 18px;
    height: 18px;
    color: ${theme.colors.textTertiary};
    margin-right: ${theme.spacing.sm};
    flex-shrink: 0;
  }
  
  input {
    border: none;
    background: none;
    outline: none;
    flex: 1;
    font-size: ${theme.typography.body};
    font-family: ${theme.typography.fontFamily};
    color: ${theme.colors.textPrimary};
    
    &::placeholder {
      color: ${theme.colors.textTertiary};
    }
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  background: ${theme.colors.accent};
  border: none;
  color: ${theme.colors.accentText};
  font-size: ${theme.typography.body};
  font-weight: ${theme.typography.semibold};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: ${theme.typography.fontFamily};
  
  svg {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    background: ${theme.colors.accentHover};
    box-shadow: ${theme.shadows.glow};
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? `${theme.colors.accent}15` : 'transparent'};
  border: 1px solid ${props => props.active ? theme.colors.accent : theme.colors.border};
  color: ${props => props.active ? theme.colors.accent : theme.colors.textSecondary};
  font-size: ${theme.typography.body};
  font-weight: ${props => props.active ? theme.typography.semibold : theme.typography.medium};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: ${theme.typography.fontFamily};
  
  &:hover {
    border-color: ${props => props.active ? theme.colors.accent : theme.colors.borderLight};
    color: ${props => props.active ? theme.colors.accent : theme.colors.textPrimary};
  }
`;

const Card = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: ${theme.colors.surfaceElevated};
  
  th {
    text-align: left;
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.typography.bodySmall};
    font-weight: ${theme.typography.semibold};
    color: ${theme.colors.textTertiary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid ${theme.colors.border};
    font-family: ${theme.typography.fontFamily};
    white-space: nowrap;
  }
`;

const TableBody = styled.tbody`
  tr {
    transition: background-color 0.2s ease;
    
    &:hover {
      background: ${theme.colors.hover};
    }
    
    &:last-child td {
      border-bottom: none;
    }
  }
  
  td {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    border-bottom: 1px solid ${theme.colors.border};
    font-family: ${theme.typography.fontFamily};
    vertical-align: middle;
  }
`;

const BookingId = styled.span`
  font-size: ${theme.typography.body};
  font-weight: ${theme.typography.semibold};
  color: ${theme.colors.accent};
  font-family: ${theme.typography.fontFamily};
`;

const CustomerCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: ${theme.borderRadius.full};
    background: ${theme.colors.accent};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${theme.typography.body};
    font-weight: ${theme.typography.bold};
    color: ${theme.colors.accentText};
    flex-shrink: 0;
  }
  
  .info {
    display: flex;
    flex-direction: column;
    
    .name {
      font-size: ${theme.typography.body};
      font-weight: ${theme.typography.medium};
      color: ${theme.colors.textPrimary};
    }
    
    .email {
      font-size: ${theme.typography.bodySmall};
      color: ${theme.colors.textTertiary};
    }
  }
`;

const VehicleCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  .icon {
    width: 32px;
    height: 32px;
    border-radius: ${theme.borderRadius.md};
    background: ${theme.colors.hover};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    svg {
      width: 16px;
      height: 16px;
      color: ${theme.colors.textSecondary};
    }
  }
  
  .info {
    display: flex;
    flex-direction: column;
    
    .name {
      font-size: ${theme.typography.body};
      font-weight: ${theme.typography.medium};
      color: ${theme.colors.textPrimary};
    }
    
    .type {
      font-size: ${theme.typography.bodySmall};
      color: ${theme.colors.textTertiary};
    }
  }
`;

const TimeCell = styled.div`
  display: flex;
  flex-direction: column;
  
  .date {
    font-size: ${theme.typography.body};
    font-weight: ${theme.typography.medium};
    color: ${theme.colors.textPrimary};
  }
  
  .time {
    font-size: ${theme.typography.bodySmall};
    color: ${theme.colors.textTertiary};
  }
`;

const DurationCell = styled.span`
  font-size: ${theme.typography.body};
  color: ${theme.colors.textSecondary};
  font-family: ${theme.typography.fontFamily};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.bodySmall};
  font-weight: ${theme.typography.medium};
  font-family: ${theme.typography.fontFamily};
  text-transform: capitalize;
  
  background: ${props => {
    switch (props.status) {
      case 'confirmed': return `${theme.colors.success}15`;
      case 'pending': return `${theme.colors.warning}15`;
      case 'completed': return `${theme.colors.info}15`;
      case 'collected': return `${theme.colors.chartQuaternary}15`;
      case 'cancelled': return `${theme.colors.error}15`;
      default: return `${theme.colors.textMuted}15`;
    }
  }};
  
  color: ${props => {
    switch (props.status) {
      case 'confirmed': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'completed': return theme.colors.info;
      case 'collected': return theme.colors.chartQuaternary;
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.textTertiary;
    }
  }};
  
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${theme.colors.textTertiary};
  }
  
  &:hover {
    background: ${theme.colors.hover};
    
    svg {
      color: ${theme.colors.textPrimary};
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xxl};
  text-align: center;
  
  .icon {
    width: 64px;
    height: 64px;
    border-radius: ${theme.borderRadius.full};
    background: ${theme.colors.hover};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: ${theme.spacing.md};
    
    svg {
      width: 32px;
      height: 32px;
      color: ${theme.colors.textTertiary};
    }
  }
  
  .title {
    font-size: ${theme.typography.h4};
    font-weight: ${theme.typography.semibold};
    color: ${theme.colors.textPrimary};
    margin-bottom: ${theme.spacing.xs};
    font-family: ${theme.typography.fontFamily};
  }
  
  .description {
    font-size: ${theme.typography.body};
    color: ${theme.colors.textSecondary};
    font-family: ${theme.typography.fontFamily};
  }
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
  
  .info {
    font-size: ${theme.typography.body};
    color: ${theme.colors.textSecondary};
    font-family: ${theme.typography.fontFamily};
  }
  
  .controls {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.xs};
  }
`;

const PageButton = styled.button<{ active?: boolean; disabled?: boolean }>`
  background: ${props => props.active ? theme.colors.accent : 'transparent'};
  border: 1px solid ${props => props.active ? theme.colors.accent : theme.colors.border};
  color: ${props => props.active ? theme.colors.accentText : props.disabled ? theme.colors.textMuted : theme.colors.textSecondary};
  font-size: ${theme.typography.body};
  font-weight: ${props => props.active ? theme.typography.semibold : theme.typography.medium};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  font-family: ${theme.typography.fontFamily};
  min-width: 36px;
  
  &:hover:not(:disabled) {
    border-color: ${props => props.active ? theme.colors.accent : theme.colors.borderLight};
    color: ${props => props.active ? theme.colors.accentText : theme.colors.textPrimary};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

// Types
interface Booking {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  vehicle: {
    name: string;
    type: string;
  };
  pickupTime: string;
  duration: string;
  status: 'all' | 'pending' | 'confirmed' | 'collected' | 'completed' | 'cancelled';
}

// Mock Data
const mockBookings: Booking[] = [
  {
    id: '#BK-001',
    customer: { name: 'John Smith', email: 'john.smith@email.com' },
    vehicle: { name: 'Toyota Camry', type: 'Sedan' },
    pickupTime: '2024-04-09T14:30:00',
    duration: '4 hours',
    status: 'confirmed',
  },
  {
    id: '#BK-002',
    customer: { name: 'Sarah Johnson', email: 'sarah.j@email.com' },
    vehicle: { name: 'Honda CR-V', type: 'SUV' },
    pickupTime: '2024-04-09T16:00:00',
    duration: '8 hours',
    status: 'pending',
  },
  {
    id: '#BK-003',
    customer: { name: 'Mike Davis', email: 'mike.davis@email.com' },
    vehicle: { name: 'Mercedes S-Class', type: 'Luxury' },
    pickupTime: '2024-04-10T09:00:00',
    duration: '6 hours',
    status: 'confirmed',
  },
  {
    id: '#BK-004',
    customer: { name: 'Emily Brown', email: 'emily.b@email.com' },
    vehicle: { name: 'Ford Transit', type: 'Van' },
    pickupTime: '2024-04-10T11:30:00',
    duration: '12 hours',
    status: 'collected',
  },
  {
    id: '#BK-005',
    customer: { name: 'David Wilson', email: 'david.w@email.com' },
    vehicle: { name: 'BMW X5', type: 'SUV' },
    pickupTime: '2024-04-08T15:00:00',
    duration: '5 hours',
    status: 'completed',
  },
  {
    id: '#BK-006',
    customer: { name: 'Lisa Anderson', email: 'lisa.a@email.com' },
    vehicle: { name: 'Audi A6', type: 'Sedan' },
    pickupTime: '2024-04-08T10:00:00',
    duration: '3 hours',
    status: 'completed',
  },
  {
    id: '#BK-007',
    customer: { name: 'Robert Taylor', email: 'robert.t@email.com' },
    vehicle: { name: 'Tesla Model S', type: 'Luxury' },
    pickupTime: '2024-04-11T13:00:00',
    duration: '24 hours',
    status: 'pending',
  },
  {
    id: '#BK-008',
    customer: { name: 'Jennifer Martinez', email: 'jen.m@email.com' },
    vehicle: { name: 'Chevrolet Suburban', type: 'SUV' },
    pickupTime: '2024-04-07T08:00:00',
    duration: '4 hours',
    status: 'cancelled',
  },
];

const statusFilters = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Collected', value: 'collected' },
  { label: 'Completed', value: 'completed' },
];

const Bookings: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.vehicle.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <PageContainer>
      <Header />
      <MainContent>
        <PageHeader>
          <PageTitle>Bookings</PageTitle>
          <HeaderActions>
            <SearchBar>
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
            </SearchBar>
            <AddButton>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Booking
            </AddButton>
          </HeaderActions>
        </PageHeader>

        <FilterContainer>
          {statusFilters.map((filter) => (
            <FilterButton
              key={filter.value}
              active={statusFilter === filter.value}
              onClick={() => {
                setStatusFilter(filter.value);
                setCurrentPage(1);
              }}
            >
              {filter.label}
            </FilterButton>
          ))}
        </FilterContainer>

        <Card>
          {paginatedBookings.length > 0 ? (
            <>
              <Table>
                <TableHead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Vehicle</th>
                    <th>Pickup Time</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </TableHead>
                <TableBody>
                  {paginatedBookings.map((booking) => {
                    const { date, time } = formatDateTime(booking.pickupTime);
                    return (
                      <tr key={booking.id}>
                        <td>
                          <BookingId>{booking.id}</BookingId>
                        </td>
                        <td>
                          <CustomerCell>
                            <div className="avatar">
                              {booking.customer.name.charAt(0)}
                            </div>
                            <div className="info">
                              <span className="name">{booking.customer.name}</span>
                              <span className="email">{booking.customer.email}</span>
                            </div>
                          </CustomerCell>
                        </td>
                        <td>
                          <VehicleCell>
                            <div className="icon">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                                <circle cx="7" cy="17" r="2"/>
                                <path d="M9 17h6"/>
                                <circle cx="17" cy="17" r="2"/>
                              </svg>
                            </div>
                            <div className="info">
                              <span className="name">{booking.vehicle.name}</span>
                              <span className="type">{booking.vehicle.type}</span>
                            </div>
                          </VehicleCell>
                        </td>
                        <td>
                          <TimeCell>
                            <span className="date">{date}</span>
                            <span className="time">{time}</span>
                          </TimeCell>
                        </td>
                        <td>
                          <DurationCell>{booking.duration}</DurationCell>
                        </td>
                        <td>
                          <StatusBadge status={booking.status}>
                            {booking.status}
                          </StatusBadge>
                        </td>
                        <td>
                          <ActionButtons>
                            <IconButton title="View Details">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                            </IconButton>
                            <IconButton title="Edit">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </IconButton>
                          </ActionButtons>
                        </td>
                      </tr>
                    );
                  })}
                </TableBody>
              </Table>
              <Pagination>
                <span className="info">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of{' '}
                  {filteredBookings.length} bookings
                </span>
                <div className="controls">
                  <PageButton
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </PageButton>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PageButton
                      key={page}
                      active={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PageButton>
                  ))}
                  <PageButton
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </PageButton>
                </div>
              </Pagination>
            </>
          ) : (
            <EmptyState>
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className="title">No bookings found</div>
              <div className="description">
                Try adjusting your search or filters to find what you're looking for.
              </div>
            </EmptyState>
          )}
        </Card>
      </MainContent>
    </PageContainer>
  );
};

export default Bookings;

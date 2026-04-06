import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../themes';

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border};
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
`;

const StatIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.lg};
  background-color: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const StatTrend = styled.span<{ positive?: boolean }>`
  font-size: ${theme.typography.bodySmall};
  color: ${props => props.positive ? theme.colors.success : theme.colors.error};
  font-weight: ${theme.typography.medium};
`;

const StatValue = styled.div`
  font-size: ${theme.typography.h3};
  font-weight: ${theme.typography.bold};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.body};
  color: ${theme.colors.textSecondary};
`;

const Section = styled.section`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.border};
  margin-bottom: ${theme.spacing.lg};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
`;

const SectionTitle = styled.h2`
  font-size: ${theme.typography.h5};
  font-weight: ${theme.typography.semibold};
  color: ${theme.colors.textPrimary};
  margin: 0;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  border: none;
  font-size: ${theme.typography.body};
  font-weight: ${theme.typography.medium};
  cursor: pointer;
  transition: all 0.2s;
  font-family: ${theme.typography.fontFamily};
  
  background-color: ${props => props.variant === 'primary' ? theme.colors.secondary : theme.colors.surface};
  color: ${props => props.variant === 'primary' ? theme.colors.textWhite : theme.colors.textPrimary};
  border: ${props => props.variant === 'primary' ? 'none' : `1px solid ${theme.colors.border}`};
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${theme.colors.borderLight};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${theme.colors.border};
  
  &:hover {
    background-color: ${theme.colors.borderLight};
  }
`;

const TableCell = styled.td`
  padding: ${theme.spacing.md};
  font-size: ${theme.typography.body};
  color: ${theme.colors.textPrimary};
`;

const TableHeader = styled.th`
  padding: ${theme.spacing.md};
  text-align: left;
  font-size: ${theme.typography.bodySmall};
  font-weight: ${theme.typography.semibold};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatusBadge = styled.span<{ status: 'active' | 'pending' | 'completed' | 'cancelled' }>`
  display: inline-flex;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.bodySmall};
  font-weight: ${theme.typography.medium};
  
  background-color: ${props => {
    switch (props.status) {
      case 'active': return '#dcfce7';
      case 'pending': return '#fef3c7';
      case 'completed': return '#dbeafe';
      case 'cancelled': return '#fee2e2';
      default: return theme.colors.borderLight;
    }
  }};
  
  color: ${props => {
    switch (props.status) {
      case 'active': return '#166534';
      case 'pending': return '#92400e';
      case 'completed': return '#1e40af';
      case 'cancelled': return '#991b1b';
      default: return theme.colors.textSecondary;
    }
  }};
`;

const DashboardScreen: React.FC = () => {
  const stats = [
    { label: 'Total Vehicles', value: '24', trend: '+12%', positive: true, icon: '🚗', color: '#3b82f6' },
    { label: 'Active Bookings', value: '18', trend: '+8%', positive: true, icon: '📅', color: '#10b981' },
    { label: 'Revenue (Month)', value: '$45,230', trend: '+23%', positive: true, icon: '💰', color: '#8b5cf6' },
    { label: 'Pending Requests', value: '7', trend: '-2%', positive: false, icon: '⏳', color: '#f59e0b' },
  ];

  const recentBookings = [
    { id: 'BK001', customer: 'John Smith', vehicle: 'Toyota Hilux', startDate: '2024-03-25', endDate: '2024-03-28', status: 'active' as const, amount: '$450' },
    { id: 'BK002', customer: 'Sarah Johnson', vehicle: 'Ford Ranger', startDate: '2024-03-26', endDate: '2024-03-30', status: 'pending' as const, amount: '$680' },
    { id: 'BK003', customer: 'Mike Brown', vehicle: 'VW Polo', startDate: '2024-03-24', endDate: '2024-03-27', status: 'completed' as const, amount: '$320' },
    { id: 'BK004', customer: 'Emily Davis', vehicle: 'Toyota Hilux', startDate: '2024-03-28', endDate: '2024-04-02', status: 'active' as const, amount: '$750' },
    { id: 'BK005', customer: 'Chris Wilson', vehicle: 'Ford Ranger', startDate: '2024-03-23', endDate: '2024-03-25', status: 'cancelled' as const, amount: '$0' },
  ];

  return (
    <DashboardContainer>
      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatHeader>
              <StatIcon color={stat.color}>{stat.icon}</StatIcon>
              <StatTrend positive={stat.positive}>{stat.trend}</StatTrend>
            </StatHeader>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      <Section>
        <SectionHeader>
          <SectionTitle>Recent Bookings</SectionTitle>
          <Button variant="primary">View All</Button>
        </SectionHeader>
        
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Booking ID</TableHeader>
              <TableHeader>Customer</TableHeader>
              <TableHeader>Vehicle</TableHeader>
              <TableHeader>Start Date</TableHeader>
              <TableHeader>End Date</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Amount</TableHeader>
            </TableRow>
          </TableHead>
          <tbody>
            {recentBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.customer}</TableCell>
                <TableCell>{booking.vehicle}</TableCell>
                <TableCell>{booking.startDate}</TableCell>
                <TableCell>{booking.endDate}</TableCell>
                <TableCell>
                  <StatusBadge status={booking.status}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </StatusBadge>
                </TableCell>
                <TableCell>{booking.amount}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Section>
    </DashboardContainer>
  );
};

export default DashboardScreen;

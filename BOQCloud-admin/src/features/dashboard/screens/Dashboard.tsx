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

const PageTitle = styled.h1`
  font-size: ${theme.typography.h2};
  font-weight: ${theme.typography.bold};
  color: ${theme.colors.textPrimary};
  margin: 0 0 ${theme.spacing.lg} 0;
  font-family: ${theme.typography.fontFamily};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${theme.glassmorphism.background};
    backdrop-filter: ${theme.glassmorphism.backdropFilter};
    border-color: ${theme.colors.borderLight};
    transform: translateY(-2px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
`;

const StatIcon = styled.div<{ color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.md};
  background: ${props => props.color ? `${props.color}15` : `${theme.colors.accent}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
    color: ${props => props.color || theme.colors.accent};
  }
`;

const StatTrend = styled.span<{ positive?: boolean }>`
  font-size: ${theme.typography.bodySmall};
  font-weight: ${theme.typography.semibold};
  color: ${props => props.positive ? theme.colors.success : theme.colors.error};
  background: ${props => props.positive ? `${theme.colors.success}15` : `${theme.colors.error}15`};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
`;

const StatValue = styled.div`
  font-size: ${theme.typography.h2};
  font-weight: ${theme.typography.bold};
  color: ${theme.colors.textPrimary};
  margin-bottom: ${theme.spacing.xs};
  font-family: ${theme.typography.fontFamily};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.body};
  color: ${theme.colors.textSecondary};
  font-family: ${theme.typography.fontFamily};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
`;

const CardTitle = styled.h3`
  font-size: ${theme.typography.h4};
  font-weight: ${theme.typography.semibold};
  color: ${theme.colors.textPrimary};
  margin: 0;
  font-family: ${theme.typography.fontFamily};
`;

const ViewAllButton = styled.button`
  background: transparent;
  border: none;
  color: ${theme.colors.accent};
  font-size: ${theme.typography.body};
  font-weight: ${theme.typography.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: ${theme.typography.fontFamily};
  
  &:hover {
    color: ${theme.colors.accentHover};
  }
`;

// Chart Components
const ChartContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

const PieChart = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: conic-gradient(
    ${theme.colors.accent} 0% 35%,
    ${theme.colors.success} 35% 60%,
    ${theme.colors.info} 60% 80%,
    ${theme.colors.chartQuaternary} 80% 100%
  );
  position: relative;
  flex-shrink: 0;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background: ${theme.colors.surface};
    border-radius: 50%;
  }
`;

const ChartLegend = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
`;

const LegendLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  .dot {
    width: 12px;
    height: 12px;
    border-radius: ${theme.borderRadius.full};
  }
  
  span {
    font-size: ${theme.typography.body};
    color: ${theme.colors.textSecondary};
    font-family: ${theme.typography.fontFamily};
  }
`;

const LegendValue = styled.span`
  font-size: ${theme.typography.body};
  font-weight: ${theme.typography.semibold};
  color: ${theme.colors.textPrimary};
  font-family: ${theme.typography.fontFamily};
`;

// Table Components
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  th {
    text-align: left;
    padding: ${theme.spacing.md};
    font-size: ${theme.typography.bodySmall};
    font-weight: ${theme.typography.semibold};
    color: ${theme.colors.textTertiary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid ${theme.colors.border};
    font-family: ${theme.typography.fontFamily};
  }
`;

const TableBody = styled.tbody`
  tr {
    transition: background-color 0.2s ease;
    
    &:hover {
      background: ${theme.colors.hover};
    }
  }
  
  td {
    padding: ${theme.spacing.md};
    border-bottom: 1px solid ${theme.colors.border};
    font-family: ${theme.typography.fontFamily};
  }
`;

const BookingId = styled.span`
  font-size: ${theme.typography.body};
  font-weight: ${theme.typography.medium};
  color: ${theme.colors.accent};
  font-family: ${theme.typography.fontFamily};
`;

const CustomerCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: ${theme.borderRadius.full};
    background: ${theme.colors.accent};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${theme.typography.bodySmall};
    font-weight: ${theme.typography.bold};
    color: ${theme.colors.accentText};
  }
  
  span {
    font-size: ${theme.typography.body};
    color: ${theme.colors.textPrimary};
  }
`;

const VehicleCell = styled.span`
  font-size: ${theme.typography.body};
  color: ${theme.colors.textSecondary};
`;

const TimeCell = styled.div`
  font-size: ${theme.typography.body};
  color: ${theme.colors.textPrimary};
  
  .time {
    color: ${theme.colors.textSecondary};
    font-size: ${theme.typography.bodySmall};
  }
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
  
  background: ${props => {
    switch (props.status) {
      case 'confirmed': return `${theme.colors.success}15`;
      case 'pending': return `${theme.colors.warning}15`;
      case 'completed': return `${theme.colors.info}15`;
      case 'collected': return `${theme.colors.chartQuaternary}15`;
      default: return `${theme.colors.textMuted}15`;
    }
  }};
  
  color: ${props => {
    switch (props.status) {
      case 'confirmed': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'completed': return theme.colors.info;
      case 'collected': return theme.colors.chartQuaternary;
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

// Mock Data
const mockStats = {
  todayBookings: { value: 24, trend: '+12%', positive: true },
  activeVehicles: { value: 18, trend: '+5%', positive: true },
  availableDrivers: { value: 12, trend: '-2%', positive: false },
  revenue: { value: '$4,250', trend: '+18%', positive: true },
};

const fleetDistribution = [
  { label: 'Sedans', value: 14, color: theme.colors.accent },
  { label: 'SUVs', value: 10, color: theme.colors.success },
  { label: 'Vans', value: 6, color: theme.colors.info },
  { label: 'Luxury', value: 4, color: theme.colors.chartQuaternary },
];

const recentBookings = [
  { id: '#BK-001', customer: 'John Smith', vehicle: 'Toyota Camry', date: 'Today', time: '14:30', status: 'confirmed' },
  { id: '#BK-002', customer: 'Sarah Johnson', vehicle: 'Honda CR-V', date: 'Today', time: '16:00', status: 'pending' },
  { id: '#BK-003', customer: 'Mike Davis', vehicle: 'Mercedes S-Class', date: 'Tomorrow', time: '09:00', status: 'confirmed' },
  { id: '#BK-004', customer: 'Emily Brown', vehicle: 'Ford Transit', date: 'Tomorrow', time: '11:30', status: 'collected' },
  { id: '#BK-005', customer: 'David Wilson', vehicle: 'BMW X5', date: 'Apr 11', time: '15:00', status: 'completed' },
];

const Dashboard: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <MainContent>
        <PageTitle>Overview</PageTitle>
        
        <StatsGrid>
          <StatCard>
            <StatHeader>
              <StatIcon>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </StatIcon>
              <StatTrend positive={mockStats.todayBookings.positive}>
                {mockStats.todayBookings.trend}
              </StatTrend>
            </StatHeader>
            <StatValue>{mockStats.todayBookings.value}</StatValue>
            <StatLabel>Today's Bookings</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatHeader>
              <StatIcon color={theme.colors.success}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                  <circle cx="7" cy="17" r="2"/>
                  <path d="M9 17h6"/>
                  <circle cx="17" cy="17" r="2"/>
                </svg>
              </StatIcon>
              <StatTrend positive={mockStats.activeVehicles.positive}>
                {mockStats.activeVehicles.trend}
              </StatTrend>
            </StatHeader>
            <StatValue>{mockStats.activeVehicles.value}</StatValue>
            <StatLabel>Active Vehicles</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatHeader>
              <StatIcon color={theme.colors.info}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </StatIcon>
              <StatTrend positive={mockStats.availableDrivers.positive}>
                {mockStats.availableDrivers.trend}
              </StatTrend>
            </StatHeader>
            <StatValue>{mockStats.availableDrivers.value}</StatValue>
            <StatLabel>Available Drivers</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatHeader>
              <StatIcon color={theme.colors.chartQuaternary}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </StatIcon>
              <StatTrend positive={mockStats.revenue.positive}>
                {mockStats.revenue.trend}
              </StatTrend>
            </StatHeader>
            <StatValue>{mockStats.revenue.value}</StatValue>
            <StatLabel>Revenue Today</StatLabel>
          </StatCard>
        </StatsGrid>
        
        <ContentGrid>
          <Card>
            <CardHeader>
              <CardTitle>Fleet Distribution</CardTitle>
              <ViewAllButton>View All</ViewAllButton>
            </CardHeader>
            <ChartContainer>
              <PieChart />
              <ChartLegend>
                {fleetDistribution.map((item) => (
                  <LegendItem key={item.label}>
                    <LegendLabel>
                      <div className="dot" style={{ background: item.color }} />
                      <span>{item.label}</span>
                    </LegendLabel>
                    <LegendValue>{item.value}</LegendValue>
                  </LegendItem>
                ))}
              </ChartLegend>
            </ChartContainer>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <ViewAllButton onClick={() => window.location.href = '/bookings'}>
                View All
              </ViewAllButton>
            </CardHeader>
            <Table>
              <TableHead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Pickup</th>
                  <th>Status</th>
                </tr>
              </TableHead>
              <TableBody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <BookingId>{booking.id}</BookingId>
                    </td>
                    <td>
                      <CustomerCell>
                        <div className="avatar">
                          {booking.customer.charAt(0)}
                        </div>
                        <span>{booking.customer}</span>
                      </CustomerCell>
                    </td>
                    <td>
                      <VehicleCell>{booking.vehicle}</VehicleCell>
                    </td>
                    <td>
                      <TimeCell>
                        {booking.date}
                        <div className="time">{booking.time}</div>
                      </TimeCell>
                    </td>
                    <td>
                      <StatusBadge status={booking.status}>
                        {booking.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </Card>
        </ContentGrid>
      </MainContent>
    </PageContainer>
  );
};

export default Dashboard;

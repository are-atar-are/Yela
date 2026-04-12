import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { theme } from '../../themes/index';

interface HeaderProps {
  onMenuClick?: () => void;
}

const HeaderContainer = styled.header`
  height: 64px;
  background-color: ${theme.colors.background};
  border-bottom: 1px solid ${theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${theme.spacing.lg};
  position: sticky;
  top: 0;
  z-index: 50;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xl};
`;

const Logo = styled.div`
  font-size: ${theme.typography.h4};
  font-weight: ${theme.typography.bold};
  color: ${theme.colors.textPrimary};
  font-family: ${theme.typography.fontFamily};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 2px;
  
  .dot {
    color: ${theme.colors.accent};
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const NavItem = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? 'rgba(232, 255, 0, 0.1)' : 'transparent'};
  border: none;
  color: ${props => props.active ? theme.colors.accent : theme.colors.textSecondary};
  font-size: ${theme.typography.body};
  font-family: ${theme.typography.fontFamily};
  font-weight: ${props => props.active ? theme.typography.semibold : theme.typography.medium};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.active ? theme.colors.accent : theme.colors.textPrimary};
    background: ${props => props.active ? 'rgba(232, 255, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.full};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  width: 280px;
  transition: all 0.2s ease;
  
  &:focus-within {
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 2px rgba(232, 255, 0, 0.1);
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: ${theme.colors.textTertiary};
    margin-right: ${theme.spacing.sm};
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

const IconButton = styled.button`
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  svg {
    width: 18px;
    height: 18px;
    color: ${theme.colors.textSecondary};
  }
  
  &:hover {
    background: ${theme.colors.hover};
    border-color: ${theme.colors.borderLight};
    
    svg {
      color: ${theme.colors.textPrimary};
    }
  }
  
  .badge {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    background-color: ${theme.colors.accent};
    border-radius: ${theme.borderRadius.full};
    border: 2px solid ${theme.colors.background};
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  background: linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentHover});
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.bold};
  font-size: ${theme.typography.body};
  color: ${theme.colors.accentText};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: ${theme.shadows.glow};
  }
`;

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/dashboard' },
    { label: 'Bookings', path: '/bookings' },
    { label: 'Employees', path: '/employees' },
    { label: 'Vehicles', path: '/vehicles' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <Logo onClick={() => navigate('/dashboard')}>
          Fleeto<span className="dot">.</span>
        </Logo>
        
        <Nav>
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              active={isActive(item.path)}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </NavItem>
          ))}
        </Nav>
      </LeftSection>
      
      <RightSection>
        <SearchBar>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Search..." />
        </SearchBar>
        
        <IconButton>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          <span className="badge" />
        </IconButton>
        
        <UserAvatar>JD</UserAvatar>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;

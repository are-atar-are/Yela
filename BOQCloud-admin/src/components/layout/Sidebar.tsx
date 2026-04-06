import React from 'react';
import styled from 'styled-components';
import { theme } from '../../themes/index';

interface SidebarProps {
  isOpen: boolean;
}

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  width: 260px;
  height: 100vh;
  background-color: ${theme.colors.sidebar};
  color: ${theme.colors.textWhite};
  position: fixed;
  left: 0;
  top: 0;
  transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  transition: transform 0.3s ease;
  z-index: 100;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h1 {
    font-size: ${theme.typography.h5};
    font-weight: ${theme.typography.bold};
    margin: 0;
    font-family: ${theme.typography.fontFamily};
  }
  
  span {
    color: ${theme.colors.accent};
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: ${theme.spacing.md} 0;
`;

const NavItem = styled.a<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  color: ${props => props.active ? theme.colors.textWhite : 'rgba(255, 255, 255, 0.7)'};
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  text-decoration: none;
  font-size: ${theme.typography.body};
  font-family: ${theme.typography.fontFamily};
  font-weight: ${props => props.active ? theme.typography.semibold : theme.typography.regular};
  border-left: 3px solid ${props => props.active ? theme.colors.accent : 'transparent'};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: ${theme.colors.textWhite};
  }
  
  svg, .icon {
    margin-right: ${theme.spacing.md};
    width: 20px;
    height: 20px;
  }
`;

const UserSection = styled.div`
  padding: ${theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${theme.borderRadius.full};
  background-color: ${theme.colors.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.bold};
  font-size: ${theme.typography.body};
`;

const UserDetails = styled.div`
  flex: 1;
  
  .name {
    font-weight: ${theme.typography.semibold};
    font-size: ${theme.typography.body};
    font-family: ${theme.typography.fontFamily};
  }
  
  .role {
    font-size: ${theme.typography.bodySmall};
    color: rgba(255, 255, 255, 0.6);
    font-family: ${theme.typography.fontFamily};
  }
`;

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navItems = [
    { label: 'Dashboard', icon: '📊', active: true },
    { label: 'Vehicles', icon: '🚗', active: false },
    { label: 'Bookings', icon: '📅', active: false },
    { label: 'Users', icon: '👥', active: false },
    { label: 'Reports', icon: '📈', active: false },
    { label: 'Settings', icon: '⚙️', active: false },
  ];

  return (
    <SidebarContainer isOpen={isOpen}>
      <Logo>
        <h1>ar<span>Fleeto</span></h1>
      </Logo>
      
      <Nav>
        {navItems.map((item) => (
          <NavItem key={item.label} active={item.active}>
            <span className="icon">{item.icon}</span>
            {item.label}
          </NavItem>
        ))}
      </Nav>
      
      <UserSection>
        <UserInfo>
          <Avatar>JD</Avatar>
          <UserDetails>
            <div className="name">John Doe</div>
            <div className="role">Administrator</div>
          </UserDetails>
        </UserInfo>
      </UserSection>
    </SidebarContainer>
  );
};

export default Sidebar;

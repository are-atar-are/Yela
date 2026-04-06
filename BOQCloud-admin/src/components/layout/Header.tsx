import React from 'react';
import styled from 'styled-components';
import { theme } from '../../themes/index';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

const HeaderContainer = styled.header`
  height: 64px;
  background-color: ${theme.colors.surface};
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
  gap: ${theme.spacing.lg};
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${theme.colors.borderLight};
  }
`;

const Title = styled.h1`
  font-size: ${theme.typography.h5};
  font-weight: ${theme.typography.semibold};
  color: ${theme.colors.textPrimary};
  font-family: ${theme.typography.fontFamily};
  margin: 0;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: ${theme.colors.borderLight};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  width: 300px;
  
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
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  transition: background-color 0.2s;
  position: relative;
  
  &:hover {
    background-color: ${theme.colors.borderLight};
  }
  
  .badge {
    position: absolute;
    top: 0;
    right: 0;
    width: 8px;
    height: 8px;
    background-color: ${theme.colors.error};
    border-radius: ${theme.borderRadius.full};
  }
`;

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={onMenuClick}>☰</MenuButton>
        <Title>{title}</Title>
      </LeftSection>
      
      <RightSection>
        <SearchBar>
          <span>🔍</span>
          <input type="text" placeholder="Search..." />
        </SearchBar>
        
        <IconButton>
          🔔
          <span className="badge" />
        </IconButton>
        
        <IconButton>⚙️</IconButton>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;

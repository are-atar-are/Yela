// Theme configuration for Fleeto Admin Dashboard
// Transcope-inspired dark theme with neon yellow accent

export const colors = {
  // Background colors
  background: '#0A0A0A',
  surface: '#141414',
  surfaceElevated: '#1A1A1A',
  hover: '#242424',
  
  // Accent colors
  accent: '#E8FF00',
  accentHover: '#D4EB00',
  accentText: '#0A0A0A',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textTertiary: '#737373',
  textMuted: '#525252',
  
  // Border colors
  border: 'rgba(255, 255, 255, 0.05)',
  borderLight: 'rgba(255, 255, 255, 0.1)',
  
  // Status colors
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Chart colors
  chartPrimary: '#E8FF00',
  chartSecondary: '#22C55E',
  chartTertiary: '#3B82F6',
  chartQuaternary: '#8B5CF6',
};

export const typography = {
  // Font family
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  
  // Font sizes
  h1: '2rem',         // 32px
  h2: '1.5rem',       // 24px
  h3: '1.25rem',      // 20px
  h4: '1.125rem',     // 18px
  h5: '1rem',         // 16px
  h6: '0.875rem',     // 14px
  body: '0.875rem',   // 14px
  bodySmall: '0.75rem', // 12px
  caption: '0.625rem',  // 10px
  
  // Font weights
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  
  // Line heights
  lineHeightTight: 1.25,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
};

export const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  xxl: '3rem',    // 48px
};

export const borderRadius = {
  sm: '0.375rem', // 6px
  md: '0.5rem',   // 8px
  lg: '0.75rem',  // 12px
  xl: '1rem',     // 16px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
  glow: '0 0 20px rgba(232, 255, 0, 0.3)',
};

export const glassmorphism = {
  background: 'rgba(20, 20, 20, 0.8)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
};

const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  glassmorphism,
};

export default theme;
export { theme };

// Theme configuration for ar-fleeto-admin
// Font: Inter (similar to design)

export const colors = {
  // Primary colors
  primary: '#1a1a1a',
  secondary: '#4f46e5', // Indigo
  accent: '#10b981', // Emerald green for success
  
  // Background colors
  background: '#f9fafb',
  surface: '#ffffff',
  sidebar: '#1f2937',
  
  // Text colors
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  textWhite: '#ffffff',
  
  // Border colors
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  
  // Status colors
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Chart colors
  chartBlue: '#3b82f6',
  chartGreen: '#10b981',
  chartYellow: '#f59e0b',
  chartPurple: '#8b5cf6',
};

export const typography = {
  // Font family
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  
  // Font sizes
  h1: '2.25rem',    // 36px
  h2: '1.875rem',   // 30px
  h3: '1.5rem',     // 24px
  h4: '1.25rem',    // 20px
  h5: '1.125rem',   // 18px
  h6: '1rem',       // 16px
  body: '0.875rem', // 14px
  bodySmall: '0.75rem', // 12px
  caption: '0.75rem',   // 12px
  
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
  sm: '0.25rem',  // 4px
  md: '0.5rem',   // 8px
  lg: '0.75rem',  // 12px
  xl: '1rem',     // 16px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export default theme;
export { theme };

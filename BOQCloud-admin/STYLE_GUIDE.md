# Fleeto Admin Dashboard - Style Guide

## Design System: Transcope-Inspired Dark Theme

### Color Palette

#### Background Colors
- **Primary Background**: `#0A0A0A` - Main page background
- **Card Background**: `#141414` - Card and container backgrounds
- **Surface Background**: `#1A1A1A` - Elevated surfaces, modals
- **Hover Background**: `#242424` - Hover states

#### Accent Colors
- **Primary Accent**: `#E8FF00` - Neon yellow for buttons, highlights, active states
- **Accent Hover**: `#D4EB00` - Darker yellow for hover states
- **Accent Text**: `#0A0A0A` - Text on accent backgrounds

#### Text Colors
- **Text Primary**: `#FFFFFF` - Main headings and important text
- **Text Secondary**: `#A3A3A3` - Body text, descriptions
- **Text Tertiary**: `#737373` - Placeholder text, disabled states
- **Text Muted**: `#525252` - Subtle text, borders

#### Status Colors
- **Success**: `#22C55E` - Success states, confirmed bookings
- **Warning**: `#F59E0B` - Pending states, warnings
- **Error**: `#EF4444` - Error states, cancelled bookings
- **Info**: `#3B82F6` - Information states

#### Chart Colors
- **Chart Primary**: `#E8FF00` - Primary chart color
- **Chart Secondary**: `#22C55E` - Secondary chart color
- **Chart Tertiary**: `#3B82F6` - Tertiary chart color
- **Chart Quaternary**: `#8B5CF6` - Fourth chart color

### Typography

#### Font Family
- **Primary**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

#### Font Sizes
- **H1**: `2rem` (32px) - Page titles
- **H2**: `1.5rem` (24px) - Section headings
- **H3**: `1.25rem` (20px) - Card titles
- **H4**: `1.125rem` (18px) - Subsection headings
- **Body**: `0.875rem` (14px) - Body text
- **Small**: `0.75rem` (12px) - Captions, labels
- **Tiny**: `0.625rem` (10px) - Badges, tags

#### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

### Spacing

- **XS**: `0.25rem` (4px)
- **SM**: `0.5rem` (8px)
- **MD**: `1rem` (16px)
- **LG**: `1.5rem` (24px)
- **XL**: `2rem` (32px)
- **2XL**: `3rem` (48px)

### Border Radius

- **SM**: `0.375rem` (6px) - Small buttons, tags
- **MD**: `0.5rem` (8px) - Inputs, small cards
- **LG**: `0.75rem` (12px) - Cards, containers
- **XL**: `1rem` (16px) - Large cards, modals
- **Full**: `9999px` - Pills, avatars

### Shadows & Effects

#### Glassmorphism
```css
background: rgba(20, 20, 20, 0.8);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.05);
```

#### Card Shadow
```css
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
```

#### Glow Effect (Accent)
```css
box-shadow: 0 0 20px rgba(232, 255, 0, 0.3);
```

### Components

#### Buttons

**Primary Button**
- Background: `#E8FF00`
- Text: `#0A0A0A`
- Border Radius: `0.5rem`
- Padding: `0.625rem 1.25rem`
- Font Weight: 600
- Hover: Background `#D4EB00`, slight scale up

**Secondary Button**
- Background: `transparent`
- Border: `1px solid #525252`
- Text: `#FFFFFF`
- Hover: Background `#242424`

**Ghost Button**
- Background: `transparent`
- Text: `#A3A3A3`
- Hover: Text `#FFFFFF`, Background `rgba(255,255,255,0.05)`

#### Cards

**Stat Card**
- Background: `#141414`
- Border: `1px solid rgba(255, 255, 255, 0.05)`
- Border Radius: `0.75rem`
- Padding: `1.5rem`
- Glassmorphism effect on hover

**Data Card**
- Background: `#141414`
- Border: `1px solid rgba(255, 255, 255, 0.05)`
- Border Radius: `0.75rem`
- Padding: `1.5rem`

#### Tables

**Data Table**
- Header Background: `#1A1A1A`
- Row Background: `#141414`
- Row Hover: `#1A1A1A`
- Border: `1px solid rgba(255, 255, 255, 0.05)`
- Cell Padding: `1rem`

#### Status Badges

**Pending**
- Background: `rgba(245, 158, 11, 0.1)`
- Text: `#F59E0B`
- Border: `1px solid rgba(245, 158, 11, 0.2)`

**Confirmed**
- Background: `rgba(34, 197, 94, 0.1)`
- Text: `#22C55E`
- Border: `1px solid rgba(34, 197, 94, 0.2)`

**Completed**
- Background: `rgba(59, 130, 246, 0.1)`
- Text: `#3B82F6`
- Border: `1px solid rgba(59, 130, 246, 0.2)`

**Cancelled**
- Background: `rgba(239, 68, 68, 0.1)`
- Text: `#EF4444`
- Border: `1px solid rgba(239, 68, 68, 0.2)`

### Navigation

#### Header
- Background: `#0A0A0A`
- Border Bottom: `1px solid rgba(255, 255, 255, 0.05)`
- Height: `64px`
- Logo: "Fleeto." with accent dot

#### Sidebar
- Background: `#0A0A0A`
- Border Right: `1px solid rgba(255, 255, 255, 0.05)`
- Width: `260px`
- Active Item: Accent color indicator

### Icons

Use Lucide React icons throughout:
- Size SM: `16px`
- Size MD: `20px`
- Size LG: `24px`

### Responsive Breakpoints

- **Mobile**: `< 640px`
- **Tablet**: `640px - 1024px`
- **Desktop**: `> 1024px`

/**
 * Design System Constants
 * Centralized theme configuration for colors, spacing, animations, and typography
 * This single source of truth prevents color/spacing duplication across components
 */

// ====== COLOR PALETTE ======
export const colors = {
  // Primary Colors (Dark theme backgrounds)
  primary: {
    bg: 'bg-primary',
    text: 'text-primary',
    DEFAULT: 'rgb(15 23 42)', // slate-900
    50: 'rgb(248 250 252)', // slate-50
    900: 'rgb(15 23 42)' // slate-900
  },
  
  // Secondary Colors (Card backgrounds)
  secondary: {
    bg: 'bg-secondary',
    text: 'text-secondary',
    DEFAULT: 'rgb(30 41 59)', // slate-800
    800: 'rgb(30 41 59)' // slate-800
  },
  
  // Text Colors
  text: {
    primary: 'text-text',
    DEFAULT: 'rgb(248 250 252)', // slate-50
    muted_value: 'rgb(148 163 184)' // slate-400
  },
  
  // Muted text helper
  textMuted: 'text-muted',
  
  // Semantic Colors
  accent: {
    bg: 'bg-accent',
    text: 'text-accent',
    DEFAULT: 'rgb(16 185 129)', // emerald-500
    400: 'rgb(52 211 153)', // emerald-400
    500: 'rgb(16 185 129)' // emerald-500
  },
  
  success: {
    bg: 'bg-success',
    text: 'text-success',
    DEFAULT: 'rgb(34 211 153)' // green-500
  },
  
  warning: {
    bg: 'bg-warning',
    text: 'text-warning',
    DEFAULT: 'rgb(245 158 11)' // amber-500
  }
} as const;

// ====== SPACING SCALE ======
export const spacing = {
  // Padding
  p: {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    '2xl': 'p-12'
  },
  
  // Margin
  m: {
    xs: 'm-2',
    sm: 'm-3',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8'
  },
  
  // Gap (for flex/grid)
  gap: {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }
} as const;

// ====== BORDER RADIUS ======
export const radius = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full'
} as const;

// ====== SHADOWS ======
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
} as const;

// ====== ANIMATIONS ======
export const animations = {
  // Animation class names
  classes: {
    fadeIn: 'fade-in',
    slideUp: 'slide-up',
    counter: 'counter',
    progressFill: 'progress-fill'
  },
  
  // Animation durations (milliseconds)
  duration: {
    fast: 200,
    normal: 500,
    slow: 1000,
    counter: 2000
  },
  
  // Animation timing
  timing: {
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear'
  }
} as const;

// ====== TYPOGRAPHY ======
export const typography = {
  font: {
    family: 'font-sans',
    sans: 'Inter, system-ui, sans-serif'
  },
  
  // Font sizes
  size: {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '6xl': 'text-6xl'
  },
  
  // Font weights
  weight: {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }
} as const;

// ====== LAYOUT PATTERNS ======
export const layout = {
  // Grid columns responsive
  grid: {
    cols1: 'grid-cols-1',
    cols2md: 'md:grid-cols-2',
    cols3lg: 'lg:grid-cols-3',
    cols4lg: 'lg:grid-cols-4'
  },
  
  // Flex utilities
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    col: 'flex flex-col'
  },
  
  // Container utilities
  container: {
    full: 'w-full',
    minHeight: 'min-h-screen'
  }
} as const;

// ====== HOVER EFFECTS ======
export const hover = {
  opacity: 'hover:opacity-80',
  scale: 'hover:scale-105',
  bgOpacity: 'hover:bg-opacity-80',
  transition: 'transition-colors duration-200',
  transitionFull: 'transition-all duration-300'
} as const;

// ====== COMMON COMPONENT CLASSES ======
export const components = {
  // Card styling
  card: {
    base: `${colors.secondary.bg} ${radius.lg} ${spacing.p.lg}`,
    hover: `hover:bg-opacity-80 ${hover.transition}`,
    interactive: `${colors.secondary.bg} ${radius.lg} ${spacing.p.lg} hover:bg-opacity-80 transition-colors duration-200`
  },
  
  // Button styling
  button: {
    base: `px-4 py-2 ${radius.md} font-medium transition-all duration-200`,
    primary: `bg-accent text-primary hover:opacity-80`,
    secondary: `bg-secondary text-text hover:bg-opacity-80`
  },
  
  // Progress bar
  progressBar: {
    container: 'relative w-full bg-secondary rounded-full h-3 overflow-hidden border border-accent border-opacity-20',
    fill: 'absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full transition-all duration-700 ease-out'
  },
  
  // Skill tag
  skillTag: `inline-block bg-accent bg-opacity-10 text-accent text-xs px-2 py-1 ${radius.sm}`,
  
  // Stats box
  statsBox: {
    base: 'text-center p-2',
    number: `text-2xl font-bold text-text`,
    label: 'text-xs text-muted'
  }
} as const;

// ====== BREAKPOINTS ======
export const breakpoints = {
  mobile: 'max-w-md',
  tablet: 'md:',
  desktop: 'lg:',
  wide: 'xl:'
} as const;

// ====== HELPER FUNCTION ======
/**
 * Combines multiple Tailwind classes intelligently
 * @param classes - Classes to combine
 * @returns Combined class string
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Gets hover state classes based on component type
 * @param type - Component type (card, button, etc)
 * @returns Tailwind class string
 */
export function getHoverClasses(type: 'card' | 'button' | 'link' = 'card'): string {
  const hoverMap = {
    card: hover.bgOpacity,
    button: hover.scale,
    link: 'hover:underline'
  };
  return `${hoverMap[type]} ${hover.transition}`;
}

/**
 * Gets responsive grid classes
 * @param cols - Number of columns for each breakpoint
 * @returns Tailwind grid class string
 */
export function getGridClasses(cols: { mobile: number; tablet: number; desktop: number }): string {
  return cn(
    `grid-cols-${cols.mobile}`,
    `md:grid-cols-${cols.tablet}`,
    `lg:grid-cols-${cols.desktop}`,
    layout.grid.cols3lg
  );
}

export default {
  colors,
  spacing,
  radius,
  shadows,
  animations,
  typography,
  layout,
  hover,
  components,
  breakpoints,
  cn,
  getHoverClasses,
  getGridClasses
};

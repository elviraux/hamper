// Pig of the Month BBQ Theme Constants

export const Colors = {
  // Primary Colors
  background: '#FDFBF7', // Warm Cream / Parchment
  primary: '#C62828', // BBQ Red
  primaryDark: '#8E0000', // Darker BBQ Red for pressed states

  // Text Colors
  textHeading: '#2D2D2D', // Dark Charcoal
  textBody: '#4E342E', // Espresso Brown
  textLight: '#757575', // Gray for subtle text
  textWhite: '#FFFFFF',

  // UI Colors
  cardBackground: '#FFFFFF',
  borderColor: '#E0E0E0',
  shadow: '#000000',
  iconInactive: '#9E9E9E',
  badgeBackground: '#C62828',

  // Logo Colors
  logoRed: '#C62828',
  logoNavy: '#1A237E',
};

export const Typography = {
  // Font Families
  fontHeading: 'serif', // Rustic serif for headings
  fontBody: 'System', // Clean sans-serif for body

  // Font Sizes
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    hero: 40,
  },

  // Font Weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Shadows = {
  card: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
};

export const colors = {
  background: '#F7F7F9',
  surface: '#FFFFFF',
  border: '#ECECF0',

  accent: '#FFC107',
  accentStrong: '#E6AB00',
  accentSoft: '#FFF8E1',

  navy: '#374151',
  navySoft: '#505A6B',
  navyDeep: '#263043',

  success: '#219A3B',
  successSoft: '#E7F6EB',
  danger: '#DC2626',
  dangerSoft: '#FDECEC',
  warning: '#F59E0B',
  warningSoft: '#FEF3E2',

  gray: '#989898',
  graySoft: '#F1F1F3',
  textPrimary: '#374151',
  textSecondary: '#989898',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const;

export const radius = {
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '20px',
  full: '9999px',
} as const;

export const typography = {
  fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '22px',
    '2xl': '28px',
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;
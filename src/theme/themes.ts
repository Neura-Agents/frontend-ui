export interface ThemeConfig {
  id: string;
  name: string;
  className: string;
  description?: string;
  isPublic: boolean;
}

export const themes: ThemeConfig[] = [
  {
    id: 'light',
    name: 'Daylight',
    className: 'light',
    description: 'Clean and bright interface for daytime use.',
    isPublic: true
  },
  {
    id: 'dark',
    name: 'Midnight',
    className: 'dark',
    description: 'Deep dark theme for reduced eye strain.',
    isPublic: true
  },
  {
    id: 'cyber',
    name: 'Cyberpunk',
    className: 'cyberpunk',
    description: 'High contrast theme with neon accents.',
    isPublic: true
  },
  {
    id: 'ocean',
    name: 'Deep Sea',
    className: 'ocean',
    description: 'Calming blue and teal aesthetic.',
    isPublic: true
  },
  {
    id: 'nature',
    name: 'Forest Nature',
    className: 'nature',
    description: 'Earth tones and organic greens.',
    isPublic: true
  },
  {
    id: 'heritage',
    name: 'Heritage',
    className: 'mycustomtheme',
    description: 'Warm colors with a classic feel.',
    isPublic: true
  }
];

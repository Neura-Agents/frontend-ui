/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#141414',
        card: '#181818',
        accent: {
          DEFAULT: '#60A5FA', // Soft Blue
          soft: '#93C5FD',
        },
        success: {
          DEFAULT: '#10B981', // Emerald 500
          soft: '#34D399',
        },
        warning: {
          DEFAULT: '#F59E0B', // Amber 500
          soft: '#FBBF24',
        }
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
      },
      fontFamily: {
        sans: ['Matter', 'sans-serif'],
        season: ['Season', 'serif'],
        'season-mix': ['SeasonMix', 'serif'],
        matter: ['Matter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

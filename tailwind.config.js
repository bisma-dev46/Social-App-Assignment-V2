/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#F2EEFF',
          100: '#E4DCFF',
          200: '#C9B9FF',
          300: '#AC93FF',
          400: '#9370FF',
          500: '#7C5CFC',
          600: '#6941E8',
          700: '#5531C9',
          800: '#412796',
          900: '#2C1B67',
        },
        accent: {
          300: '#FFA8C5',
          400: '#FF7FA6',
          500: '#FF5C93',
          600: '#E63E76',
          700: '#C22B5F',
        },
        sunny: {
          300: '#FFDA8A',
          400: '#FFC24B',
          500: '#FFA726',
        },
        ink: '#1E1533',
      },
      boxShadow: {
        glow: '0 8px 24px -8px rgba(124, 92, 252, 0.45)',
        'glow-accent': '0 8px 24px -8px rgba(255, 92, 147, 0.45)',
        soft: '0 2px 12px rgba(30, 21, 51, 0.06)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #7C5CFC 0%, #FF5C93 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, #F2EEFF 0%, #FFE9F1 100%)',
      },
    },
  },
  plugins: [],
}

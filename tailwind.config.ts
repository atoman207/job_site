import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // POP & friendly palette — warm, encouraging, low-pressure.
        brand: {
          50: '#fff4ed',
          100: '#ffe6d5',
          200: '#ffc9aa',
          300: '#ffa274',
          400: '#ff7a3c',
          500: '#ff5a1f', // primary — warm energetic orange
          600: '#f03d05',
          700: '#c72e07',
          800: '#9e290e',
          900: '#7f240f',
        },
        pop: {
          mint: '#2dd4bf',   // friendly teal accent
          sky: '#38bdf8',
          lemon: '#facc15',
          grape: '#a78bfa',
          rose: '#fb7185',
          coral: '#ff8a65',
        },
        ink: {
          DEFAULT: '#2c2320',
          soft: '#6f615a',
          faint: '#a89b93',
        },
        line: '#f0e4da',
        cream: '#fffaf6',
      },
      fontFamily: {
        rounded: [
          'var(--font-rounded)',
          '"Hiragino Maru Gothic ProN"',
          '"Zen Maru Gothic"',
          '"M PLUS Rounded 1c"',
          'Quicksand',
          'sans-serif',
        ],
        sans: [
          '"Hiragino Kaku Gothic ProN"',
          '"Yu Gothic"',
          'Meiryo',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        blob: '2rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        pop: '0 8px 0 0 rgba(199, 46, 7, 0.18)',
        soft: '0 18px 40px -18px rgba(255, 90, 31, 0.45)',
        card: '0 10px 30px -14px rgba(43, 35, 33, 0.20)',
        float: '0 24px 60px -24px rgba(43, 35, 33, 0.28)',
        glow: '0 0 0 6px rgba(255, 122, 60, 0.12)',
      },
      backgroundImage: {
        'brand-grad': 'linear-gradient(135deg, #ff7a3c 0%, #ff5a1f 55%, #fb7185 100%)',
        'sun-grad': 'linear-gradient(135deg, #ffd166 0%, #ff8a65 100%)',
        'mint-grad': 'linear-gradient(135deg, #34d399 0%, #2dd4bf 100%)',
        'sheen': 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)',
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(3deg)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(-4deg)' },
        },
        reveal: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shine: {
          '0%': { transform: 'translateX(-120%)' },
          '60%, 100%': { transform: 'translateX(220%)' },
        },
      },
      animation: {
        'bounce-slow': 'bounce-slow 2.4s ease-in-out infinite',
        'pop-in': 'pop-in 0.4s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        reveal: 'reveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee 32s linear infinite',
        shine: 'shine 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;

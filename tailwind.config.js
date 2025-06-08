// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        rumble: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0)' },
          '20%': { transform: 'translate(-1px, 1px) rotate(-1deg)' },
          '40%': { transform: 'translate(-1px, -1px) rotate(1deg)' },
          '60%': { transform: 'translate(1px, 1px) rotate(0deg)' },
          '80%': { transform: 'translate(1px, -1px) rotate(1deg)' },
        },
      },
      animation: {
        rumble: 'rumble 0.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

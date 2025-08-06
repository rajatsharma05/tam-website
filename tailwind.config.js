/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "#E5E7EB", // gray-200
        input: "#E5E7EB", // gray-200
        ring: "#D1D5DB", // gray-300
        background: "#F3F4F6", // gray-100
        foreground: "#111827", // gray-900
        primary: {
          DEFAULT: "#374151", // gray-700
          900: "#111827", // very dark grey for text-primary-900
          foreground: "#FFFFFF", // white
        },
        secondary: {
          DEFAULT: "#9CA3AF", // gray-400
          foreground: "#111827", // gray-900
        },
        destructive: {
          DEFAULT: "#EF4444", // red-500
          foreground: "#FFFFFF", // white
        },
        muted: {
          DEFAULT: "#F3F4F6", // gray-100
          foreground: "#6B7280", // gray-500
        },
        accent: {
          DEFAULT: "#D1D5DB", // gray-300
          foreground: "#111827", // gray-900
        },
        popover: {
          DEFAULT: "#FFFFFF", // white
          foreground: "#111827", // gray-900
        },
        card: {
          DEFAULT: "#FFFFFF", // white
          foreground: "#111827", // gray-900
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'lg': 'var(--shadow-lg)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}; 
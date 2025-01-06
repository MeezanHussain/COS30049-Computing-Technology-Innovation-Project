/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}','./pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Modern color palette
        primary: {
          DEFAULT: "#3B82F6", // Bright blue
          light: "#60A5FA",
          dark: "#2563EB",
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          DEFAULT: "#10B981", // Emerald
          light: "#34D399",
          dark: "#059669",
        },
        accent: {
          DEFAULT: "#8B5CF6", // Purple
          light: "#A78BFA",
          dark: "#7C3AED",
        },
        background: {
          DEFAULT: "#FFFFFF",
          alt: "#F9FAFB",
          dark: "#111827",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F3F4F6",
        },
        text: {
          DEFAULT: "#1F2937",
          muted: "#6B7280",
          light: "#9CA3AF",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.5s ease-out"
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require("tailwindcss-animate")
  ],
}
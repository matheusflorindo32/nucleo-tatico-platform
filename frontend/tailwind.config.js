/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Núcleo Tático brand colors
        nucleo: {
          primary: "#3B82F6", // Blue-500
          secondary: "#10B981", // Emerald-500
          accent: "#8B5CF6", // Violet-500
          warning: "#F59E0B", // Amber-500
          danger: "#EF4444", // Red-500
          success: "#10B981", // Emerald-500
          info: "#3B82F6", // Blue-500
          dark: "#1F2937", // Gray-800
          light: "#F9FAFB", // Gray-50
        },
        // Educational gradient colors
        education: {
          start: "#3B82F6", // Blue
          middle: "#8B5CF6", // Violet
          end: "#EC4899", // Pink
        },
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
        "pulse-slow": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "fade-out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "progress": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse-slow 2s ease-in-out infinite",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-out": "slide-out 0.3s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "progress": "progress 1s linear infinite",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "education-gradient": "linear-gradient(135deg, var(--tw-gradient-stops))",
        "education-gradient-horizontal": "linear-gradient(90deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)",
        "success-gradient": "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
        "warning-gradient": "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
        "danger-gradient": "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
      },
      boxShadow: {
        "education": "0 10px 40px -10px rgba(59, 130, 246, 0.3)",
        "education-lg": "0 20px 60px -15px rgba(59, 130, 246, 0.4)",
        "card-hover": "0 20px 40px -10px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
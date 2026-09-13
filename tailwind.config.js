/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F5F3EE",
          dim: "#EDEAE1",
          line: "#DAD4C4",
        },
        ink: {
          DEFAULT: "#1B2333",
          soft: "#3D4459",
          faint: "#7A8094",
        },
        stamp: {
          DEFAULT: "#8C3B2E",
          dark: "#6E2E24",
          light: "#F4E3DE",
        },
        pass: {
          DEFAULT: "#2F6F5E",
          light: "#E1EDE8",
        },
      },
      fontFamily: {
        display: ["'Source Serif 4'", "Georgia", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "10px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,35,51,0.06), 0 1px 0 rgba(27,35,51,0.04)",
        raised: "0 4px 16px rgba(27,35,51,0.10)",
      },
      backgroundImage: {
        'rule-lines': 'repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(27,35,51,0.05) 28px)',
      },
    },
  },
  plugins: [],
}

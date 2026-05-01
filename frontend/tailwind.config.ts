import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Gen Z vibrant palette
        primary: {
          400: "#c084fc",  // Purple
          500: "#a855f7",
          600: "#9333ea",
        },
        secondary: {
          400: "#f472b6",  // Pink
          500: "#ec4899",
          600: "#db2777",
        },
        accent: {
          400: "#2dd4bf",  // Teal
          500: "#14b8a6",
          600: "#0d9488",
        },
        dark: {
          900: "#0f0f0f",
          800: "#1a1a1a",
          700: "#262626",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        "gen-z-gradient": "linear-gradient(to right, #c084fc, #f472b6, #2dd4bf)",
      },
      animation: {
        "gradient": "gradient 8s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

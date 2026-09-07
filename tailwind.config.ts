import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        wood: {
          light: "#d4a373",
          DEFAULT: "#8b5e3c",
          dark: "#5c3d2e",
          deep: "#362217",
        },
        shelf: {
          wood: "#784315",
          dark: "#1e1e24",
          neon: "#0f172a",
          vintage: "#4a3b32",
        }
      },
      boxShadow: {
        'shelf': '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
        'book': '-5px 5px 15px rgba(0,0,0,0.4), 0 0 5px rgba(0,0,0,0.2)',
      }
    },
  },
  plugins: [],
};
export default config;

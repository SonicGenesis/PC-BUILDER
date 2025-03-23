import type { Config } from "tailwindcss";

export default {
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
        "neon-green": "var(--neon-green)",
        "neon-green-glow": "var(--neon-green-glow)",
        "neon-green-bright": "var(--neon-green-bright)",
        "dark-bg": "var(--dark-bg)",
        "card-bg": "var(--card-bg)",
      },
      boxShadow: {
        "neon-glow": "var(--border-glow)",
        "neon-glow-lg": "0 0 15px var(--neon-green)",
        "text-glow": "var(--text-glow)",
      },
      textShadow: {
        "neon": "var(--text-glow)",
        "neon-green": "0 0 5px var(--neon-green), 0 0 10px var(--neon-green)",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
} satisfies Config;

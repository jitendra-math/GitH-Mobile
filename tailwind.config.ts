import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        // 3. Apna custom variable sans family ke default font mein daal do
        sans: ['var(--font-sf-ui)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

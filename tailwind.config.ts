import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Custom SF woff2 first (as intended), then Apple system font
        // stack, then cross-platform fallbacks.
        sans: [
          "var(--font-sf-ui)",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      colors: {
        // iOS system colors — use these instead of raw hex in future.
        ios: {
          blue: "#007AFF",
          green: "#34C759",
          red: "#FF3B30",
          orange: "#FF9500",
          yellow: "#FFCC00",
          purple: "#AF52DE",
          pink: "#FF2D55",
          teal: "#5AC8FA",
          bg: "#F2F2F7",
          bgGrouped: "#EFEFF4",
          label: "#000000",
          labelSecondary: "#8E8E93",
          separator: "#C6C6C8",
        },
      },
      spacing: {
        safe: "env(safe-area-inset-bottom, 0px)",
        "safe-top": "env(safe-area-inset-top, 0px)",
      },
    },
  },
  plugins: [],
};

export default config;
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        text: "var(--text)",
        muted: "var(--muted)",

        border: "var(--border)",
        border2: "var(--border-2)",

        surface: "var(--surface)",
        surface2: "var(--surface-2)",

        ink: "var(--ink)",
        ink2: "var(--ink-2)",

        green: "var(--green)",
        greenInk: "var(--green-ink)",
        greenBg: "var(--green-bg)",

        blue: "var(--blue)",

        orange: "var(--orange)",
        orangeInk: "var(--orange-ink)",
        orangeBg: "var(--orange-bg)",

        red: "var(--red)",
        redBg: "var(--red-bg)",

        yellowBg: "var(--yellow-bg)",

        grey1: "var(--grey-1)",
        grey2: "var(--grey-2)",
      },
      borderRadius: {
        sm: "var(--r-sm)",
        md: "var(--r-md)",
        lg: "var(--r-lg)",
        xl: "var(--r-xl)",
        pill: "var(--r-pill)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        ringBlue: "var(--ring-blue)",
        ringGreen: "var(--ring-green)",
        ringRed: "var(--ring-red)",
        ringOrange: "var(--ring-orange)",
        ringYellow: "var(--ring-yellow)",
      },
    },
  },
  plugins: [],
} satisfies Config;

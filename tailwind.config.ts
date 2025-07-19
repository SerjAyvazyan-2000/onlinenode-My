import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

import flyonui from "flyonui";

import flyonui0 from "flyonui/plugin";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flyonui/dist/js/*.js",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        stem: ['Stem', 'sans-serif'],
      },
    },
  },
  plugins: [flyonui, flyonui0, heroui()],
} satisfies Config;

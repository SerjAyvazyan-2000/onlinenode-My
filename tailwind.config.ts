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
        black: "#000000",

        wheat: "#EFF2FB",
        wheat2: "#D6DBEB",
        white: "#FFFFFF",
        white3: "#E2E6F4",

        blue: "#141F36",

        gray2: "#4E5C7A",
        gray: " #5E5F62",
      },
      fontFamily: {
        stem: ["Stem", "sans-serif"],
      },
      zIndex: {
        hero: "10",
        content: "5",
        background: "-1",
        "bg-deep": "-2",
        modal: "1000",
        overlay: "900",
        burger: "1001",
      },
    },
  },
  plugins: [flyonui, flyonui0, heroui()],
} satisfies Config;

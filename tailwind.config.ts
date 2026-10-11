import type { Config } from "tailwindcss";

// Design tokens taken from the Figma file "Mobile App Design Task".
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Auth screens (Mulish)
        ink: "#292E39", // Black Color 1
        muted: "#696969", // Black color 3
        brand: "#FF5701", // primary CTA ("Button For Becho APP")
        "brand-light": "#FB7632", // Brand Color Light (caret, timer)
        field: "#F5F5F5",
        line: "#C7C7C7",
        placeholder: "#A4A5B2",
        // Food screens (League Spartan)
        orange: "#E95322", // Orange Base
        "orange-2": "#FFDECF", // Orange 2
        yellow: "#F5CB58", // Yellow Base
        "yellow-2": "#F3E9B5", // Yellow 2
        cocoa: "#391713", // Font
        "font-2": "#F8F8F8", // Font 2
        divider: "#E2E2E2",
        card: "#FAFAFA",
      },
      fontFamily: {
        mulish: ["Mulish", "system-ui", "sans-serif"],
        inter: ["Inter", "system-ui", "sans-serif"],
        spartan: ['"League Spartan"', "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grad-call": "linear-gradient(90deg, #FF986D 0%, #FF6E6A 100%)",
        "grad-wallet": "linear-gradient(90deg, #83D4F3 0%, #4A70C7 100%)",
      },
    },
  },
  plugins: [],
};

export default config;

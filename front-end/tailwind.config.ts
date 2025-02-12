import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      color: {
        // Screen and Buttons colors
        primary: "#3EB075", // Dark Green
        secondary: "#86EFAC", // Orange
        variant: "#D1F5DC", // Light Green
        black: "#0F172A", // Black
        background: "#F2F4F7", // Light Gray
        white: "#FFFFFF", // White

        // For Categories Icons & Other Icons
        red: "#DD0A0A", // Red
        purple: "#9747FF", // Purple
        blue: "#304FFE", // Blue
        Orange: "FFAE4C", // Orange
        indigo: "#5856D6", // Indigo
        pink: "#AF52DE", // Pink
        greem: "#34C759", // Green
        brown: "#A2845E", // Brown
        mint: "#00C7BE", // Mint
        Aqua: "#32ADE6", // Aqua
        gray: "#909090", // Gray
      },

      // Font Family
      fontFamily: {
        Header: ["Poppins-Bold", "sans-serif"], // 36px
        Header2: ["Poppins-Bold", "sans-serif"], //24px
        Description: ["Poppins-Medium", "sans-serif"], // 16px
        Description2: ["Poppins-Medium", "sans-serif"], // 14px
        smalltext: ["Poppins-Regular", "sans-serif"], //12px
        extrasmall: ["Poppins-Regular", "sans-serif"], //10px
      },
    },
  },
  plugins: [],
} satisfies Config;

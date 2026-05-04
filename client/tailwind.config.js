export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["'DM Sans'", "sans-serif"] },
      colors: {
        dark: { 900: "#0a0a0f", 800: "#12121a", 700: "#1a1a27", 600: "#252535" },
        accent: { DEFAULT: "#7c6af7", hover: "#6b58f0", glow: "#7c6af730" },
        income: "#22d3a5",
        expense: "#f87171",
      }
    }
  }
}
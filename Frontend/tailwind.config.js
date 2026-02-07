export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#12002b",
        purple: "#6d4aff",
        light: "#ede9f9",
      },
      boxShadow: {
        glow: "0 0 25px rgba(167,139,250,0.4)",
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        poppins: ["Poppins", "sans-serif"],
        cormorant: ["Cormorant Garamond", "serif"],
      },
      borderRadius: {
        xl2: "26px",
      },
    },
  },
  plugins: [],
};

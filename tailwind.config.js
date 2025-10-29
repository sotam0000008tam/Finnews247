/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ nếu ThemeToggle thêm class 'dark' vào <html>
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    // "./app/**/*.{js,jsx,ts,tsx}", // bật nếu bạn dùng thư mục app/
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        lg: "1.5rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1600px", // ✅ site rộng 1600px
      },
    },
    extend: {
      // Nếu muốn thêm breakpoint siêu rộng:
      // screens: { "3xl": "1920px" },
    },
  },
  plugins: [],
};

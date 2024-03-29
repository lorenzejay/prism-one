module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      i5: "320px",
      i6: "375px",
      xs: "500px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1770px",
      "4xl": "2000px",
    },
    fontFamily: {
      sans: ["Rubik", "system-ui"],
      serif: ["ui-serif", "Georgia"],
      mono: ["ui-monospace", "SFMono-Regular"],
      display: ["Oswald"],
      body: ['"Open Sans"'],
    },
    maxHeight: {
      0: "0",
      "1/4": "25vh",
      "1/2": "50vh",
      "3/4": "75vh",
      85: "85vh",
      full: "100vh",
    },
    minHeight: {
      0: "0",
      "1/4": "25vh",
      "1/2": "50vh",
      "3/4": "75vh",
      "4/5": "80vh",
      full: "100vh",
    },
    extend: {
      colors: {
        gray: {
          theme: "#F9F9F9",
        },
        blue: {
          theme: "#1D4757",
        },
        orange: {
          theme: "#FEC828",
        },
      },
      minHeight: {
        "1/2": "50vh",
      },
      height: (theme) => ({
        "3/4": "75vh",
        "5/8": "62vh",
        "1/2": "50vh",
        "4/5": "80vh",
      }),
      transitionProperty: {
        height: "height",
        width: "width",
        spacing: "margin, padding",
      },
    },
  },
  plugins: [],
  corePlugins: {
    // ...
    fontFamily: false,
  },
};

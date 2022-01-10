module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
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
      "1/2": "50bh",
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
        blue: {
          theme: "#1D4757",
        },
        orange: {
          theme: "#FEC828",
        },
      },
      screens: {
        i5: "320px",
        i6: "375px",
        "3xl": "1800px",
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
  variants: {
    extend: {
      borderWidth: ["focus", "hover"],
      padding: ["focus", "hover"],
    },
  },
  plugins: [],
  corePlugins: {
    // ...
    fontFamily: false,
  },
};

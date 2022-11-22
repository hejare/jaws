const transitions = {
  fast: "0.3s ease-out",
  medium: "0.5s ease-out",
};

const colors = {
  black: "#000000",
  darkGrey: "#181818",
  mediumGrey: "#313131",
  lightGrey: "#e5e5e5",

  white: "#ffffff",
  pink: "#ab018c",

  lightGreen: "#71B16B",
  darkGreen: "#3e5e3b",

  orange: "#E28C47",
  brown: "rgb(165, 42, 42)",
  red: "#f87260",
};

const typography = {
  body: {
    fontFamily: "Roboto-Regular",
    letterSpacing: "0.46px",
  },
  h1: {
    fontFamily: "Roboto-Black",
  },
  h2: {
    fontFamily: "Roboto-Black",
  },
  h3: {
    fontFamily: "Roboto-Black",
  },
  a: {
    textDecoration: "underline",
  },
};

const base = {
  typography,
  transitions,
  borders: {
    base: "1px solid",
    borderRadius: "4px",
  },
};

const dark = {
  ...base,
  palette: {
    background: {
      primary: colors.darkGrey,
      secondary: colors.mediumGrey,
      accent: {
        primary: colors.lightGreen,
        secondary: colors.darkGreen,
      },
      error: colors.white,
      hover: colors.white,
      active: `${colors.white}50`,
      disabled: colors.mediumGrey,
      backdrop: `${colors.black}80`,
    },

    text: {
      primary: colors.white,
      secondary: colors.darkGrey,
      heading: {
        primary: colors.pink,
      },
      error: colors.red,
      hover: colors.lightGreen,
      active: colors.black,
      disabled: colors.white,
    },

    border: {
      primary: colors.mediumGrey,
      secondary: colors.pink,
    },

    action: {
      text: colors.white,
      background: colors.darkGrey,
      border: colors.mediumGrey,
    },

    actionHover: {
      text: colors.lightGreen,
      background: colors.white,
      border: colors.white,
    },

    ...colors,
  },
};

const themes = {
  dark,
  typography,
};

export type Theme = {
  borders: {
    base: string;
    borderRadius: string;
  };
  palette: {
    background: {
      primary: string;
      secondary: string;
      accent: {
        primary: string;
        secondary: string;
      };
      error: string;
      active: string;
      disabled: string;
    };

    text: {
      primary: string;
      secondary: string;
      heading: {
        primary: string;
      };
      error: string;
      active: string;
      disabled: string;
    };

    border: {
      primary: string;
      secondary: string;
    };

    action: {
      text: string;
      background: string;
      border: string;
    };

    actionHover: {
      text: string;
      background: string;
      border: string;
    };
  };
};
export default themes;

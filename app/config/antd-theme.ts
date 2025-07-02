import { ThemeConfig } from "antd";

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: "#1677ff",
    colorBgBase: "#ffffff",
    colorTextBase: "#000000",
    colorBorder: "#d9d9d9",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorFillSecondary: "#f5f5f5",
  },
  components: {
    Layout: {
      bodyBg: "#ffffff",
      headerBg: "#ffffff",
      siderBg: "#ffffff",
    },
    Menu: {
      itemBg: "transparent",
      itemSelectedBg: "#e6f4ff",
      itemHoverBg: "#f5f5f5",
    },
    Drawer: {
      colorBgElevated: "#ffffff",
    },
  },
};

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary: "#1677ff",
    colorBgBase: "#141414",
    colorTextBase: "#ffffff",
    colorBorder: "#424242",
    colorBgContainer: "#1f1f1f",
    colorBgElevated: "#262626",
    colorFillSecondary: "#262626",
  },
  components: {
    Layout: {
      bodyBg: "#141414",
      headerBg: "#1f1f1f",
      siderBg: "#1f1f1f",
    },
    Menu: {
      itemBg: "transparent",
      itemSelectedBg: "#1677ff26",
      itemHoverBg: "#262626",
      darkItemBg: "transparent",
      darkItemSelectedBg: "#1677ff26",
      darkItemHoverBg: "#262626",
    },
    Drawer: {
      colorBgElevated: "#1f1f1f",
    },
  },
};

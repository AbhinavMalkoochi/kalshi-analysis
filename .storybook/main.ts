import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"] ,
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal: async (config) => {
    if (config.resolve?.alias) {
      config.resolve.alias["next/link"] = "/home/abhinav/projects/market-terminal/.storybook/next-link.tsx";
    } else if (config.resolve) {
      config.resolve.alias = {
        "next/link": "/home/abhinav/projects/market-terminal/.storybook/next-link.tsx",
      };
    }
    return config;
  },
  docs: {
    autodocs: false,
  },
};

export default config;

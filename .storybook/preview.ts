import type { Preview } from "@storybook/react";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "terminal",
      values: [
        { name: "terminal", value: "#020617" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
};

export default preview;

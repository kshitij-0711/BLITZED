    // tailwind.config.ts
    import type { Config } from "tailwindcss";

    const config: Config = {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // Ensure your TSX files are included
      ],
      theme: {
        extend: {},
      },
      plugins: [require("daisyui")],
      daisyui: {
        themes: ["light", "dark", "cupcake"], // Example themes
      },
    };

    export default config;
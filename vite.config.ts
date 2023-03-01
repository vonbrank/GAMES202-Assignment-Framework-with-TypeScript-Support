import checker from 'vite-plugin-checker'
import { defineConfig } from "vite";

export default defineConfig ({
  plugins: [
    checker({
      typescript: true,
    }),
  ],
})
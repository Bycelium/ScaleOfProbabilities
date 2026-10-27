import { defineConfig } from "vite";

export default defineConfig({
  define: {
    __VERCEL_OBSERVABILITY_CLIENT_CONFIG__: JSON.stringify(process.env.VERCEL_OBSERVABILITY_CLIENT_CONFIG ?? ""),
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/main.ts", "src/locales/types.ts"],
      thresholds: {
        lines: 100,
        branches: 100,
        functions: 100,
        statements: 100,
      },
    },
  },
});

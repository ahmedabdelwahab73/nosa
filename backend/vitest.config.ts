import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    // Tests share one MongoDB test database, so files run one at a time.
    fileParallelism: false,
    env: {
      NODE_ENV: "test",
      MONGODB_URI: process.env.MONGODB_TEST_URI ?? "mongodb://127.0.0.1:27017/nosa_test",
      REVALIDATE_SECRET: "test-secret",
      FRONTEND_URL: "http://localhost:3999",
      JWT_ACCESS_SECRET: "test-access-secret-test-access-secret-0000",
      CRON_SECRET: "test-cron-secret-0000",
    },
  },
});

import { defineConfig } from "vitest/config";
export default defineConfig({
    test: {
        watch: false,
        projects: ["packages/*"],
        coverage: {
            provider: "istanbul",
            reporter: ["text", "json", "html", "json-summary"],
            reportsDirectory: "coverage",
            thresholds: {
                lines: 100,
                branches: 100,
                functions: 100,
                statements: 100,
            },
        },
    },
});

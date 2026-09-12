import { execSync } from "child_process";

process.chdir(import.meta.dirname);

it("playwright test", () => {
	execSync("pnpm exec playwright test -c playwright.config.ts", { stdio: ["ignore", "ignore", "inherit"] });
});

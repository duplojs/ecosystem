import { execSync } from "child_process";

process.chdir(import.meta.dirname);

it("bun test", () => {
	execSync("pnpm exec bun test bun/*.test.ts", { stdio: ["ignore", "ignore", "inherit"] });
});

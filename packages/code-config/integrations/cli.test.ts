import { execSync } from "child_process";

process.chdir(import.meta.dirname);

describe("cli", () => {
	it("oxlint", () => {
		execSync("pnpm exec duplojs-oxlint --version");
	});

	it("commitlint", () => {
		execSync("pnpm exec duplojs-commitlint --version");
	});
});

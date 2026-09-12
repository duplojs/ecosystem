import { execSync } from "child_process";

process.chdir(import.meta.dirname);

describe("cli", () => {
	it(
		"oxlint",
		{ timeout: 0 },
		() => {
			execSync("pnpm exec duplojs-oxlint --version");
		},
	);

	it(
		"commitlint",
		{ timeout: 0 },
		() => {
			execSync("pnpm exec duplojs-commitlint --version");
		},
	);
});

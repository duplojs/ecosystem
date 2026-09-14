import { execSync } from "child_process";

process.chdir(import.meta.dirname);

describe("cli", () => {
	it(
		"eslint",
		{ timeout: 0 },
		() => {
			execSync("pnpm exec duplojs-eslint --version");
		},
	);
});

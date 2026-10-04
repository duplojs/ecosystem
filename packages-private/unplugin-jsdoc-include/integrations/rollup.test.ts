import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const integrationPath = import.meta.dirname;

describe("rollup integration", () => {
	it("prints included JSDoc in declaration files", () => {
		const result = spawnSync("pnpm", ["run", "build:rollup"], {
			cwd: integrationPath,
			encoding: "utf8",
		});

		expect(result, result.stderr || result.stdout).toMatchObject({
			status: 0,
		});

		const declaration = readFileSync(
			join(integrationPath, "dist/rollup/mySuperDomain/mySuperFunction.d.ts"),
			"utf8",
		);

		expect(declaration).toMatchSnapshot();
	});
});

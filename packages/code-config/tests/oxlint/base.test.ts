import { Linter } from "eslint";
import { DOxlint } from "@scripts";

describe("base import rules", () => {
	const config = {
		plugins: { "duplojs-plugin": DOxlint.plugin },
		rules: {
			"duplojs-plugin/prefer-import-path": DOxlint.baseRules["duplojs-plugin/prefer-import-path"],
			"duplojs-plugin/prefer-namespace-from-barrel": DOxlint.baseRules["duplojs-plugin/prefer-namespace-from-barrel"],
			"duplojs-plugin/prefer-namespace-import": DOxlint.baseRules["duplojs-plugin/prefer-namespace-import"],
		},
	} satisfies Linter.Config;

	it("includes barrel defaults in the base, open, test and generated overrides", () => {
		const expected = ["error", DOxlint.defaultPreferNamespaceFromBarrelOptions];
		const override = DOxlint.createOxlintOverride({ files: ["**/*.ts"] });
		const openOverride = DOxlint.createOxlintOverride({
			files: ["**/*.ts"],
			ruleset: { open: true },
		});
		const testOverride = DOxlint.createOxlintOverride({
			files: ["**/*.test.ts"],
			ruleset: { test: true },
		});

		expect(DOxlint.baseRules["duplojs-plugin/prefer-namespace-from-barrel"]).toEqual(expected);
		expect(openOverride.rules?.["duplojs-plugin/prefer-namespace-from-barrel"]).toEqual(expected);
		expect(testOverride.rules?.["duplojs-plugin/prefer-namespace-from-barrel"]).toEqual(expected);
		expect(override.rules?.["duplojs-plugin/prefer-namespace-from-barrel"]).toEqual(expected);
	});

	it.each([
		{
			code: "import { DArray } from \"@duplojs/lang\";\nDArray.map(values, mapper);",
			expected: "import * as DArray from \"@duplojs/lang/array\";\nDArray.map(values, mapper);",
		},
		{
			code: "import { A } from \"@duplojs/lang\";\nA.map(values, mapper);",
			expected: "import * as DArray from \"@duplojs/lang/array\";\nDArray.map(values, mapper);",
		},
		{
			code: "import { DSFile } from \"@duplojs/server\";\nDSFile.readTextFile(path);",
			expected: "import * as DSFile from \"@duplojs/server/file\";\nDSFile.readTextFile(path);",
		},
		{
			code: "import { SF } from \"@duplojs/server\";\nSF.readTextFile(path);",
			expected: "import * as DSFile from \"@duplojs/server/file\";\nDSFile.readTextFile(path);",
		},
		{
			code: "import { DSCommon, setEnvironment, TESTImplementation } from \"@duplojs/server\";\nDSCommon.getProcessArguments();\nsetEnvironment(\"TEST\");\nTESTImplementation.clear();",
			expected: "import { setEnvironment, TESTImplementation } from \"@duplojs/server\";\nimport * as DSCommon from \"@duplojs/server/common\";\nDSCommon.getProcessArguments();\nsetEnvironment(\"TEST\");\nTESTImplementation.clear();",
		},
	])("corrects $code with the default import rules", ({ code, expected }) => {
		const linter = new Linter();
		const result = linter.verifyAndFix(code, config);
		const repeated = linter.verifyAndFix(result.output, config);

		expect(result.messages).toEqual([]);
		expect(result.output).toBe(expected);
		expect(repeated.fixed).toBe(false);
		expect(repeated.messages).toEqual([]);
	});

	it("routes every configured domain consistently with the namespace import defaults", () => {
		for (const [path, namespace] of Object.entries(DOxlint.defaultPreferNamespaceImportPaths)) {
			expect(DOxlint.defaultPreferNamespaceFromBarrelOptions.namespaces).toHaveProperty(namespace, path);
		}
	});
});

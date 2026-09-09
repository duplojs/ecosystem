import { Linter } from "eslint";

import { DuplojsOxlint } from "@scripts";

describe("camelcase", () => {
	it("accepts camel case", () => {
		const linter = new Linter({ configType: "flat" });
		const messages = linter.verify("const camelCase = 1;", {
			languageOptions: {
				ecmaVersion: 2024,
			},
			plugins: {
				"duplojs-plugin": DuplojsOxlint.plugin,
			},
			rules: {
				"duplojs-plugin/camelcase": "error",
			},
		});

		expect(messages).toEqual([]);
	});

	it("rejects snake case", () => {
		const linter = new Linter({ configType: "flat" });
		const messages = linter.verify("const snake_case = 1;", {
			languageOptions: {
				ecmaVersion: 2024,
			},
			plugins: {
				"duplojs-plugin": DuplojsOxlint.plugin,
			},
			rules: {
				"duplojs-plugin/camelcase": "error",
			},
		});

		expect(messages).toHaveLength(1);
		expect(messages[0]?.ruleId).toBe("duplojs-plugin/camelcase");
	});
});

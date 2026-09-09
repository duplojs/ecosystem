import { Linter } from "eslint";

import { DuplojsOxlint } from "@scripts";

describe("prefer-destructuring", () => {
	it("accepts destructuring", () => {
		const linter = new Linter({ configType: "flat" });
		const messages = linter.verify("const [value] = values;", {
			languageOptions: {
				ecmaVersion: 2024,
			},
			plugins: {
				"duplojs-plugin": DuplojsOxlint.plugin,
			},
			rules: {
				"duplojs-plugin/prefer-destructuring": [
					"error",
					{
						array: true,
					},
				],
			},
		});

		expect(messages).toEqual([]);
	});

	it("rejects index access", () => {
		const linter = new Linter({ configType: "flat" });
		const messages = linter.verify("const value = values[0];", {
			languageOptions: {
				ecmaVersion: 2024,
			},
			plugins: {
				"duplojs-plugin": DuplojsOxlint.plugin,
			},
			rules: {
				"duplojs-plugin/prefer-destructuring": [
					"error",
					{
						array: true,
					},
				],
			},
		});

		expect(messages).toHaveLength(1);
		expect(messages[0]?.ruleId).toBe("duplojs-plugin/prefer-destructuring");
	});
});

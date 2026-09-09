import { Linter } from "eslint";

import { DuplojsOxlint } from "@scripts";

describe("dot-notation", () => {
	it("accepts dot access", () => {
		const linter = new Linter({ configType: "flat" });
		const messages = linter.verify("const value = object.name;", {
			languageOptions: {
				ecmaVersion: 2024,
			},
			plugins: {
				"duplojs-plugin": DuplojsOxlint.plugin,
			},
			rules: {
				"duplojs-plugin/dot-notation": "error",
			},
		});

		expect(messages).toEqual([]);
	});

	it("rejects bracket access", () => {
		const linter = new Linter({ configType: "flat" });
		const messages = linter.verify("const value = object['name'];", {
			languageOptions: {
				ecmaVersion: 2024,
			},
			plugins: {
				"duplojs-plugin": DuplojsOxlint.plugin,
			},
			rules: {
				"duplojs-plugin/dot-notation": "error",
			},
		});

		expect(messages).toHaveLength(1);
		expect(messages[0]?.ruleId).toBe("duplojs-plugin/dot-notation");
	});
});

import { Linter } from "eslint";

import { DuplojsOxlint } from "@scripts";

describe("no-unreachable-loop", () => {
	it("accepts reachable loop", () => {
		const linter = new Linter({ configType: "flat" });
		const messages = linter.verify("while (condition) { condition = update(); }", {
			languageOptions: {
				ecmaVersion: 2024,
			},
			plugins: {
				"duplojs-plugin": DuplojsOxlint.plugin,
			},
			rules: {
				"duplojs-plugin/no-unreachable-loop": "error",
			},
		});

		expect(messages).toEqual([]);
	});

	it("rejects unreachable loop", () => {
		const linter = new Linter({ configType: "flat" });
		const messages = linter.verify("while (condition) { break; }", {
			languageOptions: {
				ecmaVersion: 2024,
			},
			plugins: {
				"duplojs-plugin": DuplojsOxlint.plugin,
			},
			rules: {
				"duplojs-plugin/no-unreachable-loop": "error",
			},
		});

		expect(messages).toHaveLength(1);
		expect(messages[0]?.ruleId).toBe("duplojs-plugin/no-unreachable-loop");
	});
});

import { DOxlint } from "@scripts";

describe("engineConfig", () => {
	it("provides the shared plugins and engine options without a global ruleset", () => {
		expect(DOxlint.engineConfig.plugins).toEqual(["typescript", "eslint"]);
		expect(DOxlint.engineConfig.jsPlugins).toEqual([
			{
				name: "duplojs-plugin",
				specifier: DOxlint.pluginSpecifier,
			},
			{
				name: "@stylistic",
				specifier: "@stylistic/eslint-plugin",
			},
		]);
		expect(DOxlint.engineConfig).not.toHaveProperty("rules");
		expect(DOxlint.engineConfig.options.typeAware).toBe(true);
		expect(DOxlint.engineConfig.categories.correctness).toBe("off");
	});
});

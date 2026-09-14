import * as eslintConfig from "@scripts";
import { baseConfig } from "@scripts/base";
import { openConfig } from "@scripts/open";
import { testConfig } from "@scripts/test";
import { vueConfig } from "@scripts/vue";

describe("eslint config exports", () => {
	it("exports base config", () => {
		expect(eslintConfig.baseConfig).toBe(baseConfig);
	});

	it("exports open config", () => {
		expect(eslintConfig.openConfig).toBe(openConfig);
	});

	it("exports test config", () => {
		expect(eslintConfig.testConfig).toBe(testConfig);
	});

	it("exports vue config", () => {
		expect(eslintConfig.vueConfig).toBe(vueConfig);
	});
});

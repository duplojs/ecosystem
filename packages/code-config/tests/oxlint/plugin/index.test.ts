import { DuplojsOxlint } from "@scripts";
import pluginDefault, { plugin, pluginSpecifier } from "@scripts/oxlint/plugin";

describe("plugin/index", () => {
	it("loads the endpoint", () => {
		expect(pluginDefault).toBe(plugin);
		expect(plugin).toBe(DuplojsOxlint.plugin);
	});

	it("matches the specifier", () => {
		expect(pluginSpecifier).toBe("@duplojs/code-config/oxlint/plugin");
		expect(pluginSpecifier).toBe(DuplojsOxlint.pluginSpecifier);
	});

	it("registers the rules", () => {
		expect(plugin.meta.name).toBe("duplojs-plugin");
		expect(Object.keys(plugin.rules).sort()).toEqual([
			"camelcase",
			"dot-notation",
			"no-unreachable-loop",
			"prefer-destructuring",
		]);
	});
});

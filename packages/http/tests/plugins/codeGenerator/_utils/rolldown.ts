import type { InputOptions, Plugin, MinimalPluginContext, PluginContext } from "rolldown";

export function runOptions(plugin: Plugin, options: InputOptions = {}) {
	if (typeof plugin.options !== "function") {
		throw new Error("Expected an options hook");
	}
	return plugin.options.call({} as MinimalPluginContext, options);
}

export function runResolveId(plugin: Plugin, id: string, importer?: string) {
	if (typeof plugin.resolveId !== "function") {
		throw new Error("Expected a resolveId hook");
	}
	return plugin.resolveId.call({} as PluginContext, id, importer, {
		kind: "import-statement",
		isEntry: false,
	});
}

export function runLoad(plugin: Plugin, id: string) {
	if (typeof plugin.load !== "function") {
		throw new Error("Expected a load hook");
	}
	return plugin.load.call({} as PluginContext, id);
}

import type * as DStoTS from "@scripts/toTypescript";

export function createImportContext(): DStoTS.MapImportContext {
	const importContext = new Map();

	importContext.set("@duplojs/lang/dataStructure", {
		namespace: ["DDataStructure"],
	});

	return importContext;
}

import type * as DDataStructure from "@duplojs/lang/dataStructure";
import type { MapContext } from "./context";
import type { MapImportContext } from "./importContext";

export type TransformerHookAction = "stop" | "next";

export interface TransformerHookOutput {
	readonly structure: DDataStructure.Structure;
	readonly action: TransformerHookAction;
}

export interface TransformerHookParams {
	readonly structure: DDataStructure.Structure;
	readonly context: MapContext;
	readonly importContext: MapImportContext;

	output(
		action: TransformerHookAction,
		structure: DDataStructure.Structure,
	): TransformerHookOutput;
}

export type TransformerHook = (
	params: TransformerHookParams,
) => TransformerHookOutput;

import type * as DDataStructure from "@duplojs/lang/dataStructure";
import type { MapContext } from "./context";

export type TransformerHookAction = "stop" | "next";

export interface TransformerHookOutput {
	readonly structure: DDataStructure.Structure;
	readonly action: TransformerHookAction;
}

export interface TransformerHookParams {
	readonly structure: DDataStructure.Structure;
	readonly context: MapContext;

	output(
		action: TransformerHookAction,
		structure: DDataStructure.Structure,
	): TransformerHookOutput;
}

export type TransformerHook = (
	params: TransformerHookParams,
) => TransformerHookOutput;

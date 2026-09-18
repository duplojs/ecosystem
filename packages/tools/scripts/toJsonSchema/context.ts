import type * as DDataStructure from "@duplojs/lang/dataStructure";
import type { JsonSchema } from "./result";

export interface MapContextValue {
	readonly name: string;
	readonly schema: JsonSchema;
	readonly isOptional: boolean;
}

export type MapContext = Map<
	DDataStructure.Structure,
	MapContextValue
>;

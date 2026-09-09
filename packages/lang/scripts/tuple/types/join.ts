import type * as DCommon from "@scripts/common";
import type { Shift } from "./shift";

export type Join<
	GenericTuple extends DCommon.AnyTuple<string> | readonly [],
	GenericSeparator extends string,
	GenericDepth extends readonly unknown[] = [],
> = GenericTuple extends DCommon.AnyTuple<string>
	? DCommon.IsEqual<GenericDepth["length"], 100> extends true
		? string
		: Shift<GenericTuple> extends infer InferredRest extends readonly string[]
			? InferredRest extends DCommon.AnyTuple<string>
				? Join<
					InferredRest,
					GenericSeparator,
					[...GenericDepth, 0]
				> extends infer InferredRestResult extends string
					? `${GenericTuple[0]}${GenericSeparator}${InferredRestResult}`
					: never
				: InferredRest extends readonly []
					? GenericTuple[0]
					: `${GenericTuple[0]}${GenericSeparator}${string}`
			: never
	: "";

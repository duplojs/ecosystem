import type * as DArray from "@scripts/array";
import type { Create } from "./types";

type FromOutput<
	GenericArray extends readonly unknown[],
> = DArray.ExtractLengthEqual<GenericArray, unknown> extends DArray.LengthEqual<infer InferredLength extends number>
	? DArray.ReapplyCompatiblesConstraints<
		GenericArray,
		Create<GenericArray[number], InferredLength>,
		"maxElements"
	>
	: DArray.ExtractMinElements<GenericArray, unknown> extends DArray.MinElements<infer InferredMin extends number>
		? DArray.ReapplyCompatiblesConstraints<
			GenericArray,
			readonly [
				...Create<GenericArray[number], InferredMin>,
				...GenericArray[number][],
			],
			"maxElements"
		>
		: GenericArray;

export function from<
	GenericArray extends readonly unknown[],
>(
	source: GenericArray,
): FromOutput<GenericArray>;

export function from(
	source: readonly unknown[],
) {
	return source;
}

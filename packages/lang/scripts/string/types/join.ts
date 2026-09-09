import type * as DCommon from "@scripts/common";

export type Join<
	GenericStrings extends readonly string[],
	GenericSeparator extends string = "",
	GenericDepth extends readonly unknown[] = [],
> = GenericStrings extends readonly []
	? ""
	: GenericStrings extends readonly [
		infer InferredString extends string,
		...infer InferredRest extends readonly string[],
	]
		? DCommon.IsEqual<GenericDepth["length"], 100> extends true
			? string
			: InferredRest extends readonly []
				? InferredString
				: Join<
					InferredRest,
					GenericSeparator,
					[...GenericDepth, unknown]
				> extends infer InferredRestResult extends string
					? `${InferredString}${GenericSeparator}${InferredRestResult}`
					: never
		: string;


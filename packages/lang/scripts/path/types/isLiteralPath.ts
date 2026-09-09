import type * as DCommon from "@scripts/common";
import type * as DString from "@scripts/string";

type CheckSegment<
	GenericSegment extends readonly string[],
	GenericDotIsPass extends boolean,
	GenericIsFirst extends boolean = true,
> = GenericSegment extends readonly []
	? true
	: GenericSegment extends readonly [
		infer InferredFirst extends string,
		...infer InferredRest extends readonly string[],
	]
		? DCommon.Or<[
			DCommon.IsEqual<".", InferredFirst>,
			DString.Includes<InferredFirst, "/">,
			DString.Includes<InferredFirst, "\0">,
			DCommon.And<[
				DCommon.IsEqual<GenericIsFirst, false>,
				DCommon.IsEqual<"", InferredFirst>,
			]>,
			DCommon.And<[
				DCommon.IsEqual<GenericDotIsPass, true>,
				DCommon.IsEqual<"..", InferredFirst>,
			]>,
		]> extends true
			? false
			: CheckSegment<
				InferredRest,
				DCommon.Not<
					DCommon.IsEqual<InferredFirst, "..">
				>,
				false
			>
		: false;

export type IsLiteralPath<
	GenericValue extends string,
> = DString.IsLiteral<GenericValue> extends true
	? GenericValue extends ""
		? false
		: GenericValue extends "/"
			? true
			: GenericValue extends "."
				? true
				: DString.Split<
					GenericValue,
					"/"
				> extends infer InferredResult extends readonly string[]
					? CheckSegment<InferredResult, false>
					: never
	: false;

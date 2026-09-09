import type * as DCommon from "@scripts/common";

export type Unmatched<
	GenericValue extends unknown,
	GenericTuple extends readonly any[],
> = DCommon.Or<[
	DCommon.IsEqual<GenericValue, never>,
	DCommon.IsEqual<GenericTuple, never>,
]> extends true
	? GenericValue
	: DCommon.IsUnion<GenericTuple> extends true
		? DCommon.LastUnionElement<GenericTuple> extends infer InferredArray extends readonly any[]
			? Unmatched<GenericValue, InferredArray> extends infer InferredResult
				? DCommon.IsEqual<InferredResult, never> extends true
					? never
					: Unmatched<
						InferredResult,
						Exclude<GenericTuple, InferredArray>
					>
				: never
			: never
		: GenericValue extends readonly any[]
			? (
				| (
					[
						Extract<GenericValue, readonly any[]>,
						Exclude<Extract<GenericTuple, readonly any[]>, DCommon.AnyTuple>,
					] extends [
						infer InferredValue extends readonly any[],
						infer InferredArray extends readonly any[],
					]
						? DCommon.Or<[
							DCommon.IsEqual<InferredValue, never>,
							DCommon.IsEqual<InferredArray, never>,
						]> extends true
							? never
							: InferredValue[number] extends InferredArray[number]
								? never
								: InferredValue
						: never
				)
				| (
					[
						Extract<GenericValue, DCommon.AnyTuple>,
						Extract<GenericTuple, DCommon.AnyTuple>,
					] extends [
						infer InferredValue extends readonly any[],
						infer InferredArray extends readonly any[],
					]
						? DCommon.Or<[
							DCommon.IsEqual<InferredValue, never>,
							DCommon.IsEqual<InferredArray, never>,
						]> extends true
							? never
							: [
								InferredValue,
								InferredArray,
							] extends [
								readonly [infer InferredValueFirst, ...infer InferredValueRest],
								readonly [infer InferredArrayFirst, ...infer InferredArrayRest],
							]
								? InferredValueFirst extends InferredArrayFirst
									? InferredArrayRest extends readonly []
										? never
										: InferredValueRest extends readonly []
											? InferredValue
											: Unmatched<
												InferredValueRest,
												InferredArrayRest
											> extends infer InferredRestResult
												? DCommon.IsEqual<
													InferredRestResult,
													never
												> extends true
													? never
													: InferredValue
												: never
									: InferredValue
								: never
						: never
				)
			)
			: GenericValue;

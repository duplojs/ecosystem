import type * as DCommon from "@scripts/common";

export type Matched<
	GenericValue extends unknown,
	GenericArray extends readonly any[],
> = GenericValue extends readonly any[]
	? DCommon.Or<[
		DCommon.IsEqual<GenericValue, never>,
		DCommon.IsEqual<GenericArray, never>,
	]> extends true
		? never
		: DCommon.IsUnion<GenericArray> extends true
			? GenericArray extends any
				? Matched<GenericValue, GenericArray>
				: never
			: (
				| (
					[
						Extract<GenericValue, readonly any[]>,
						Exclude<Extract<GenericArray, readonly any[]>, DCommon.AnyTuple>,
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
								? InferredValue
								: never
						: never
				)
				| (
					[
						Extract<GenericValue, DCommon.AnyTuple>,
						Extract<GenericArray, DCommon.AnyTuple>,
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
								? Extract<InferredValueFirst, any> extends InferredArrayFirst
									? InferredArrayRest extends readonly []
										? InferredValue
										: Matched<
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
									: never
								: never
						: never
				)
				| (
					[
						Extract<GenericValue, readonly any[]>,
						Extract<GenericArray, readonly []>,
					] extends [
						infer InferredValue extends readonly any[],
						infer InferredArray extends readonly any[],
					]
						? DCommon.Or<[
							DCommon.IsEqual<InferredValue, never>,
							DCommon.IsEqual<InferredArray, never>,
						]> extends true
							? never
							: InferredValue
						: never
				)
			)
	: never;

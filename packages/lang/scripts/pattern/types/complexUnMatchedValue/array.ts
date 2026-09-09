import type * as DCommon from "@scripts/common";
import type { ComplexUnMatchedValue } from ".";

type ComplexUnMatchedArrayTuple<
	GenericInput extends unknown,
	GenericPatternValue extends unknown,
> = (
	[
		Exclude<Extract<GenericInput, readonly any[]>, DCommon.AnyTuple>,
		Extract<GenericPatternValue, DCommon.AnyTuple>,
	] extends [
		infer InferredInput,
		infer InferredPatternValue,
	]
		? DCommon.IsEqual<InferredPatternValue, never> extends true
			? never
			: InferredInput
		: never
);

type ComplexUnMatchedTupleTuple<
	GenericInput extends unknown,
	GenericPatternValue extends unknown,
> = (
	[
		Extract<GenericInput, DCommon.AnyTuple>,
		Extract<GenericPatternValue, DCommon.AnyTuple>,
	] extends [
		infer InferredInput,
		infer InferredPatternValue,
	]
		? DCommon.IsEqual<InferredPatternValue, never> extends true
			? never
			: DCommon.IsUnion<InferredPatternValue> extends true
				? never
				: InferredInput extends InferredPatternValue
					? never
					: [
						InferredInput,
						InferredPatternValue,
					] extends [
						readonly [infer InferredInputFirst, ...infer InferredInputRest],
						readonly [infer InferredPatternValueFirst, ...infer InferredPatternValueRest],
					]
						? Extract<
							ComplexUnMatchedValue<
								InferredInputFirst,
								InferredPatternValueFirst
							>,
							any
						> extends infer InferredResultFirst
							? InferredPatternValueRest extends readonly []
								? DCommon.IsEqual<InferredResultFirst, never> extends true
									? never
									: [InferredResultFirst, ...InferredInputRest]
								: ComplexUnMatchedValue<
									InferredInputRest,
									InferredPatternValueRest
								> extends infer InferredResultRest
									? DCommon.IsEqual<InferredResultRest, never> extends true
										? never
										: [
											DCommon.IsEqual<InferredResultFirst, never> extends true
												? InferredInputFirst
												: InferredResultFirst,
											...Extract<
												DCommon.IsEqual<InferredResultRest, never> extends true
													? InferredPatternValueRest
													: InferredResultRest,
												readonly any[]
											>,
										]
									: never
							: never
						: never
		: never
);

type ComplexUnMatchedArrayArray<
	GenericInput extends unknown,
	GenericPatternValue extends unknown,
> = (
	[
		Exclude<Extract<GenericInput, readonly any[]>, DCommon.AnyTuple>,
		Exclude<Extract<GenericPatternValue, readonly any[]>, DCommon.AnyTuple>,
	] extends [
		infer InferredInput extends readonly any[],
		infer InferredPatternValue extends readonly any[],
	]
		? DCommon.IsEqual<InferredInput, never> extends true
			? never
			: InferredInput[number] extends infer InferredInnerValue
				? InferredInnerValue extends any
					? Extract<
						InferredInnerValue,
						InferredPatternValue[number]
					> extends infer InferredObviousMatch
						? DCommon.IsEqual<InferredObviousMatch, never> extends true
							? ComplexUnMatchedValue<
								InferredInnerValue,
								InferredPatternValue[number]
							> extends infer InferredValue
								? DCommon.IsEqual<InferredValue, never> extends true
									? never
									: InferredInput
								: never
							: never
						: never
					: never
				: never
		: never
);

export type ComplexUnMatchedArray<
	GenericInput extends unknown,
	GenericPatternValue extends unknown,
> = Exclude<GenericPatternValue, readonly []> extends infer InferredPatternValue
	? DCommon.IsEqual<InferredPatternValue, never> extends true
		? never
		: (
			| ComplexUnMatchedTupleTuple<GenericInput, InferredPatternValue>
			| ComplexUnMatchedArrayTuple<GenericInput, InferredPatternValue>
			| ComplexUnMatchedArrayArray<GenericInput, InferredPatternValue>
		)
	: never;

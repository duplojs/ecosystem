import type * as DCommon from "@scripts/common";
import type { ComplexMatchedValue } from ".";

type ComplexMatchedArrayTuple<
	GenericInput extends unknown,
	GenericPatternValue extends unknown,
> = (
	[
		Exclude<Extract<GenericInput, any[]>, DCommon.AnyTuple>,
		Extract<GenericPatternValue, DCommon.AnyTuple>,
	] extends [
		infer InferredInput,
		infer InferredPatternValue,
	]
		? InferredInput extends any[]
			? InferredPatternValue extends DCommon.AnyTuple
				? Extract<
					InferredInput,
					InferredPatternValue
				> extends infer InferredObviousMatchedValue
					? DCommon.IsEqual<InferredObviousMatchedValue, never> extends false
						? InferredObviousMatchedValue
						: InferredPatternValue extends readonly [
							infer InferredPatternFirst,
							...infer InferredPatternRest,
						]
							? [
								Extract<
									ComplexMatchedValue<
										InferredInput[number],
										InferredPatternFirst
									>,
									any
								>,
								...(
									InferredPatternRest extends readonly []
										? InferredInput
										: Extract<
											ComplexMatchedValue<
												InferredInput,
												InferredPatternRest
											>,
											any[]
										>
								),
							]
							: never
					: never
				: never
			: never
		: never
);

type ComplexMatchedTupleTuple<
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
		? InferredInput extends any
			? InferredPatternValue extends any
				? Extract<
					InferredInput,
					InferredPatternValue
				> extends infer InferredObviousMatchedValue
					? DCommon.IsEqual<InferredObviousMatchedValue, never> extends false
						? InferredObviousMatchedValue
						: [
							InferredInput,
							InferredPatternValue,
						] extends [
							readonly [infer InferredInputFirst, ...infer inferredInputRest],
							readonly [infer InferredPatternValueFirst, ...infer inferredPatternValueRest],
						]
							? Extract<
								ComplexMatchedValue<
									InferredInputFirst,
									InferredPatternValueFirst
								>,
								any
							> extends infer InferredResult
								? Extract<InferredResult, any> extends InferredInputFirst
									? DCommon.IsEqual<InferredResult, never> extends true
										? never
										: [
											InferredResult,
											...Extract<
												(
													DCommon.IsEqual<
														inferredPatternValueRest[number],
														never
													> extends true
														? inferredInputRest
														: ComplexMatchedValue<
															inferredInputRest,
															inferredPatternValueRest
														>
												),
												readonly any[]
											>,
										]
									: never
								: never
							: never
					: never
				: never
			: never
		: never
);

type ComplexMatchedArrayArray<
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
		? DCommon.IsEqual<InferredPatternValue, never> extends true
			? never
			: InferredPatternValue extends InferredInput
				? InferredInput
				: Extract<
					ComplexMatchedValue<
						InferredInput[number],
						InferredPatternValue[number]
					>,
					any
				>[]
		: never
);

export type ComplexMatchedArray<
	GenericInput extends unknown,
	GenericPatternValue extends unknown,
> = GenericPatternValue extends readonly []
	? DCommon.BreakGenericLink<GenericInput>
	: (
		| ComplexMatchedTupleTuple<GenericInput, GenericPatternValue>
		| ComplexMatchedArrayTuple<GenericInput, GenericPatternValue>
		| ComplexMatchedArrayArray<GenericInput, GenericPatternValue>
	);

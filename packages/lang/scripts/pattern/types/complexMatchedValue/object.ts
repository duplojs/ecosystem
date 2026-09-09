import type * as DCommon from "@scripts/common";
import type * as DObject from "@scripts/object";
import type { ComplexMatchedValue } from ".";

export type ComplexMatchedObject<
	GenericInput extends unknown,
	GenericPatternValue extends unknown,
> = (
	[
		Exclude<Extract<GenericInput, object>, readonly any[] | DCommon.AnyFunction>,
		Exclude<Extract<GenericPatternValue, object>, readonly any[] | DCommon.AnyFunction>,
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
						: DCommon.IsEqual<
							Extract<keyof InferredInput, keyof InferredPatternValue>,
							keyof InferredPatternValue
						> extends false
							? never
							: DCommon.SimplifyTopLevel<
								& Omit<InferredInput, keyof InferredPatternValue>
								& {
									-readonly [Prop in keyof InferredPatternValue]: Extract<
										ComplexMatchedValue<
											InferredInput[Extract<Prop, keyof InferredInput>],
											InferredPatternValue[Prop]
										>,
										any
									>
								}
							> extends infer InferredResult extends object
								? Extract<InferredResult, any> extends InferredInput
									? DCommon.IsEqual<InferredResult, InferredInput> extends true
										? InferredInput
										: DCommon.IsEqual<
											DObject.GetPropsWithValue<
												Pick<
													InferredResult,
													Extract<keyof InferredPatternValue, keyof InferredResult>
												>,
												never
											>,
											never
										> extends true
											? InferredResult
											: never
									: never
								: never
					: never
				: never
			: never
		: never
);

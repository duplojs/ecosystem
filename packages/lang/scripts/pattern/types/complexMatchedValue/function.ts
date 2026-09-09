import type * as DCommon from "@scripts/common";

export type ComplexMatchedFunction<
	GenericInput extends unknown,
	GenericPatternValue extends unknown,
> = (
	[
		Extract<GenericInput, DCommon.AnyFunction>,
		Extract<GenericPatternValue, DCommon.AnyFunction>,
	] extends [
		infer inferredInput extends DCommon.AnyFunction,
		infer inferredPatternValue extends DCommon.AnyFunction,
	]
		? Extract<
			inferredInput,
			inferredPatternValue
		> extends infer inferredValue
			? DCommon.IsEqual<inferredValue, never> extends true
				? inferredPatternValue
				: inferredValue
			: never
		: never
);

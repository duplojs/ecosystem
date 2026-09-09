import type { EligiblePrimitiveMatch } from "..";

export type ComplexUnMatchedPrimitive<
	GenericInput extends unknown,
	GenericPatternValue extends unknown,
> = (
	[
		Extract<GenericInput, EligiblePrimitiveMatch>,
		Extract<GenericPatternValue, EligiblePrimitiveMatch>,
	] extends [
		infer inferredInput,
		infer inferredPatternValue,
	]
		? Exclude<
			inferredInput,
			inferredPatternValue
		>
		: never
);

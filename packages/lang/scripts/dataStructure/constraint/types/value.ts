import type * as DCommon from "@scripts/common";
import { type Constraint } from "../base";

export type ConstraintValue<
	GenericConstraint extends Constraint,
> = GenericConstraint extends Constraint<infer InferredInput, infer InferredOutput>
	? DCommon.Or<[
		DCommon.IsEqual<InferredInput, InferredOutput>,
		DCommon.IsEqual<InferredOutput, any>,
		DCommon.IsEqual<InferredOutput, unknown>,
	]> extends true
		? InferredInput
		: InferredOutput extends (
			& infer InferredRest
			& InferredInput
		)
			? DCommon.Coalescing<
				InferredRest,
				unknown,
				InferredInput
			>
			: InferredInput
	: never;

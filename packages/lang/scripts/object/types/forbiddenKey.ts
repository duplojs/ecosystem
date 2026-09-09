import type * as DCommon from "@scripts/common";

export type ForbiddenKey<
	GenericObject extends object,
	GenericKey extends string,
> = (
	GenericKey extends keyof GenericObject
		? DCommon.ComputedTypeError<`Key "${GenericKey}" is forbidden.`>
		: never
) extends infer InferredResult
	? DCommon.IsEqual<InferredResult, never> extends true
		? unknown
		: InferredResult
	: never;

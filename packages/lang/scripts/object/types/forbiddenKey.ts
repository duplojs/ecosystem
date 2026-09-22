import type * as DCommon from "@scripts/common";

export type ForbiddenKey<
	GenericObject extends object,
	GenericKey extends string | number,
> = DCommon.IsNever<GenericKey> extends true
	? unknown
	: (
	`${GenericKey}` extends `${Extract<keyof GenericObject, string | number>}`
		? DCommon.ComputedTypeError<`Key "${GenericKey}" is forbidden.`>
		: never
	) extends infer InferredResult
		? DCommon.IsEqual<InferredResult, never> extends true
			? unknown
			: InferredResult
		: never;

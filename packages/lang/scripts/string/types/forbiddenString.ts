import type * as DCommon from "@scripts/common";

export type ForbiddenIn<
	GenericValue extends string,
	GenericCharacters extends string,
> = DCommon.IsEqual<
	| (
		GenericCharacters extends string
			? DCommon.IsEqual<GenericValue, GenericCharacters>
			: never
	)
	| false,
	boolean
> extends true
	? DCommon.ComputedTypeError<`String "${GenericCharacters}" is forbidden in value.`>
	: GenericValue;

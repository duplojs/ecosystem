import type * as DCommon from "@scripts/common";

export type ForbiddenContain<
	GenericValue extends string,
	GenericCharacters extends string,
> = (
	GenericValue extends `${string}${GenericCharacters}${string}`
		? true
		: false
) extends false
	? unknown
	: DCommon.ComputedTypeError<`Value "${GenericValue}" must not contain character "${GenericCharacters}".`>;

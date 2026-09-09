import type * as DString from "@scripts/string";

export type IsNegative<
	GenericValue extends number,
> = DString.Includes<`${GenericValue}`, "-">;


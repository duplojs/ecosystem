import type * as DCommon from "@scripts/common";
import type * as DString from "@scripts/string";
import { type IsLiteral } from "./isLiteral";

export type IsInteger<
	GenericValue extends number,
> = DCommon.And<[
	IsLiteral<GenericValue>,
	DCommon.Not<DString.Includes<`${GenericValue}`, ".">>,
]>;

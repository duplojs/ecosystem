import type * as DCommon from "@scripts/common";
import type { IsGreater } from "./isGreater";

export type IsLessOrEqual<
	GenericValue extends number,
	GenericReference extends number,
> = DCommon.IsEqual<GenericValue, GenericReference> extends true
	? true
	: DCommon.Not<IsGreater<GenericValue, GenericReference>>;

export type IsLess<
	GenericValue extends number,
	GenericReference extends number,
> = DCommon.Not<DCommon.IsEqual<GenericValue, GenericReference>> extends true
	? DCommon.Not<IsGreater<GenericValue, GenericReference>>
	: false;

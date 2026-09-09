import type * as DCommon from "@scripts/common";
import type { IsNegative } from "./isNegative";

export type IsPositive<
	GenericValue extends number,
> = DCommon.Not<IsNegative<GenericValue>>;


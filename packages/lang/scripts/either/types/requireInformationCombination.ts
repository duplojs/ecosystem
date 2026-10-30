import type * as DCommon from "@scripts/common";
import type * as DTuple from "@scripts/tuple";
import type { Left } from "../left";
import type { Right } from "../right";

export type RequireInformationCombination<
	GenericCombination extends DCommon.AnyTuple<Right | Left>,
> = DTuple.HasSpread<GenericCombination> extends true
	? DCommon.ComputedTypeError<"Information combinations must be finite tuples.">
	: DCommon.ForbiddenUnion<GenericCombination>;

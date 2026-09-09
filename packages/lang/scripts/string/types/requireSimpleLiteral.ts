import type * as DCommon from "@scripts/common";
import { type RequireLiteral } from "./requireLiteral";

export type RequireSimpleLiteral<
	GenericString extends string,
> = GenericString extends DCommon.BaseConstraint
	? DCommon.ComputedTypeError<"Constrained strings are not allowed.">
	: RequireLiteral<GenericString>;

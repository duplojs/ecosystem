import type * as DCommon from "@scripts/common";
import { type IsLiteral } from "./isLiteral";
import { type MaxSafeNumber, type MinSafeNumber } from "../constraints";
import { type IsGreaterOrEqual } from "./isGreater";
import { type IsLessOrEqual } from "./isLess";

export type IsSafe<
	GenericInput extends number,
> = DCommon.And<[
	IsLiteral<GenericInput>,
	IsGreaterOrEqual<GenericInput, MinSafeNumber>,
	IsLessOrEqual<GenericInput, MaxSafeNumber>,
]>;

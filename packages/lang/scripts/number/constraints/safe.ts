import type * as DCommon from "@scripts/common";

export type MinSafeNumber = -9007199254740991;
export type MaxSafeNumber = 9007199254740991;

export interface Safe extends DCommon.Constraint<"number-safe"> {}

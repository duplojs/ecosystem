import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DNumber from "@scripts/number";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const strictPositiveConstraintKind = createKind("strict-positive-constraint");

export interface StrictPositiveConstraintDefinition extends ConstraintDefinition {

}

export interface StrictPositiveConstraint extends DCommon.Forward<
	& Constraint<
		number,
		number & DNumber.StrictPositive,
		StrictPositiveConstraintDefinition
	>
	& DKind.Kind<typeof strictPositiveConstraintKind>
> {}

export const StrictPositiveConstraint = createConstraint(
	strictPositiveConstraintKind,
	({ init }) => () => init<StrictPositiveConstraint>(
		{},
		{
			executeCheck: (_self, data) => DNumber.isStrictPositive(data)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

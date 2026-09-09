import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DNumber from "@scripts/number";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const strictNegativeConstraintKind = createKind("strict-negative-constraint");

export interface StrictNegativeConstraintDefinition extends ConstraintDefinition {

}

export interface StrictNegativeConstraint extends DCommon.Forward<
	& Constraint<
		number,
		number & DNumber.StrictNegative,
		StrictNegativeConstraintDefinition
	>
	& DKind.Kind<typeof strictNegativeConstraintKind>
> {}

export const StrictNegativeConstraint = createConstraint(
	strictNegativeConstraintKind,
	({ init }) => () => init<StrictNegativeConstraint>(
		{},
		{
			executeCheck: (_self, data) => DNumber.isStrictNegative(data)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

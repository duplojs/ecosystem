import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DNumber from "@scripts/number";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const positiveConstraintKind = createKind("positive-constraint");

export interface PositiveConstraintDefinition extends ConstraintDefinition {

}

export interface PositiveConstraint extends DCommon.Forward<
	& Constraint<
		number,
		number & DNumber.Positive,
		PositiveConstraintDefinition
	>
	& DKind.Kind<typeof positiveConstraintKind>
> {}

export const PositiveConstraint = createConstraint(
	positiveConstraintKind,
	({ init }) => () => init<PositiveConstraint>(
		{},
		{
			executeCheck: (_self, data) => DNumber.isPositive(data)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

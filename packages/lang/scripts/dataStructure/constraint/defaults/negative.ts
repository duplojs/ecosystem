import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DNumber from "@scripts/number";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const negativeConstraintKind = createKind("negative-constraint");

export interface NegativeConstraintDefinition extends ConstraintDefinition {

}

export interface NegativeConstraint extends DCommon.Forward<
	& Constraint<
		number,
		number & DNumber.Negative,
		NegativeConstraintDefinition
	>
	& DKind.Kind<typeof negativeConstraintKind>
> {}

export const NegativeConstraint = createConstraint(
	negativeConstraintKind,
	({ init }) => () => init<NegativeConstraint>(
		{},
		{
			executeCheck: (_self, data) => DNumber.isNegative(data)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

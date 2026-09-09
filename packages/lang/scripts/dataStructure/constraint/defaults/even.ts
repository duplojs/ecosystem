import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DNumber from "@scripts/number";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const evenConstraintKind = createKind("even-constraint");

export interface EvenConstraintDefinition extends ConstraintDefinition {

}

export interface EvenConstraint extends DCommon.Forward<
	& Constraint<
		number,
		number & DNumber.Even,
		EvenConstraintDefinition
	>
	& DKind.Kind<typeof evenConstraintKind>
> {}

export const EvenConstraint = createConstraint(
	evenConstraintKind,
	({ init }) => () => init<EvenConstraint>(
		{},
		{
			executeCheck: (_self, data) => DNumber.isEven(data)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

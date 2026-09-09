import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DNumber from "@scripts/number";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const safeConstraintKind = createKind("safe-constraint");

export interface SafeConstraintDefinition extends ConstraintDefinition {

}

export interface SafeConstraint extends DCommon.Forward<
	& Constraint<
		number,
		number & DNumber.Safe,
		SafeConstraintDefinition
	>
	& DKind.Kind<typeof safeConstraintKind>
> {}

export const SafeConstraint = createConstraint(
	safeConstraintKind,
	({ init }) => () => init<SafeConstraint>(
		{},
		{
			executeCheck: (_self, data) => DNumber.isSafe(data)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DNumber from "@scripts/number";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const greaterThanOrEqualConstraintKind = createKind("greater-than-or-equal-constraint");

export interface GreaterThanOrEqualConstraintDefinition<
	GenericThreshold extends number = number,
> extends ConstraintDefinition {
	readonly threshold: GenericThreshold;
}

export interface GreaterThanOrEqualConstraint<
	GenericThreshold extends number = number,
> extends DCommon.Forward<
		& Constraint<
			number,
			number & DNumber.GreaterThanOrEqual<GenericThreshold>,
			GreaterThanOrEqualConstraintDefinition<GenericThreshold>
		>
		& DKind.Kind<typeof greaterThanOrEqualConstraintKind>
	> {
}

export const GreaterThanOrEqualConstraint = createConstraint(
	greaterThanOrEqualConstraintKind,
	({ init }) => <
		GenericThreshold extends number,
	>(threshold: GenericThreshold) => init<
		GreaterThanOrEqualConstraint<GenericThreshold>
	>(
		{ threshold },
		{
			executeCheck: (self, data) => DNumber.greaterThanOrEqual(
				data,
				DCommon.forward<number>(self.definition.threshold),
			)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

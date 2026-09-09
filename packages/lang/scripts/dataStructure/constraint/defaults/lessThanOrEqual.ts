import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DNumber from "@scripts/number";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const lessThanOrEqualConstraintKind = createKind("less-than-or-equal-constraint");

export interface LessThanOrEqualConstraintDefinition<
	GenericThreshold extends number = number,
> extends ConstraintDefinition {
	readonly threshold: GenericThreshold;
}

export interface LessThanOrEqualConstraint<
	GenericThreshold extends number = number,
> extends DCommon.Forward<
		& Constraint<
			number,
			number & DNumber.LessThanOrEqual<GenericThreshold>,
			LessThanOrEqualConstraintDefinition<GenericThreshold>
		>
		& DKind.Kind<typeof lessThanOrEqualConstraintKind>
	> {
}

export const LessThanOrEqualConstraint = createConstraint(
	lessThanOrEqualConstraintKind,
	({ init }) => <
		GenericThreshold extends number,
	>(threshold: GenericThreshold) => init<
		LessThanOrEqualConstraint<GenericThreshold>
	>(
		{ threshold },
		{
			executeCheck: (self, data) => DNumber.lessThanOrEqual(
				data,
				DCommon.forward<number>(self.definition.threshold),
			)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

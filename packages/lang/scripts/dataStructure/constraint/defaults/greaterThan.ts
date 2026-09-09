import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DNumber from "@scripts/number";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const greaterThanConstraintKind = createKind("greater-than-constraint");

export interface GreaterThanConstraintDefinition<
	GenericThreshold extends number = number,
> extends ConstraintDefinition {
	readonly threshold: GenericThreshold;
}

export interface GreaterThanConstraint<
	GenericThreshold extends number = number,
> extends DCommon.Forward<
		& Constraint<
			number,
			number & DNumber.GreaterThan<GenericThreshold>,
			GreaterThanConstraintDefinition<GenericThreshold>
		>
		& DKind.Kind<typeof greaterThanConstraintKind>
	> {
}

export const GreaterThanConstraint = createConstraint(
	greaterThanConstraintKind,
	({ init }) => <
		GenericThreshold extends number,
	>(threshold: GenericThreshold) => init<
		GreaterThanConstraint<GenericThreshold>
	>(
		{ threshold },
		{
			executeCheck: (self, data) => DNumber.greaterThan(
				data,
				DCommon.forward<number>(self.definition.threshold),
			)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

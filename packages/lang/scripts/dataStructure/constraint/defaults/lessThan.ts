import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DNumber from "@scripts/number";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const lessThanConstraintKind = createKind("less-than-constraint");

export interface LessThanConstraintDefinition<
	GenericThreshold extends number = number,
> extends ConstraintDefinition {
	readonly threshold: GenericThreshold;
}

export interface LessThanConstraint<
	GenericThreshold extends number = number,
> extends DCommon.Forward<
		& Constraint<
			number,
			number & DNumber.LessThan<GenericThreshold>,
			LessThanConstraintDefinition<GenericThreshold>
		>
		& DKind.Kind<typeof lessThanConstraintKind>
	> {
}

export const LessThanConstraint = createConstraint(
	lessThanConstraintKind,
	({ init }) => <
		GenericThreshold extends number,
	>(threshold: GenericThreshold) => init<
		LessThanConstraint<GenericThreshold>
	>(
		{ threshold },
		{
			executeCheck: (self, data) => DNumber.lessThan(
				data,
				DCommon.forward<number>(self.definition.threshold),
			)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

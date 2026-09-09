import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DArray from "@scripts/array";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const minElementsConstraintKind = createKind("min-elements-constraint");

export interface MinElementsConstraintDefinition<
	GenericMin extends number = number,
> extends ConstraintDefinition {
	readonly min: GenericMin;
}

export interface MinElementsConstraint<
	GenericMin extends number = number,
> extends DCommon.Forward<
		& Constraint<
			readonly unknown[],
			readonly unknown[] & DArray.MinElements<GenericMin>,
			MinElementsConstraintDefinition<GenericMin>
		>
		& DKind.Kind<typeof minElementsConstraintKind>
	> {
}

export const MinElementsConstraint = createConstraint(
	minElementsConstraintKind,
	({ init }) => <
		GenericMin extends number,
	>(min: GenericMin) => init<
		MinElementsConstraint<GenericMin>
	>(
		{ min },
		{
			executeCheck: (self, data) => DArray.minElements(
				data,
				DCommon.forward<number>(self.definition.min),
			)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

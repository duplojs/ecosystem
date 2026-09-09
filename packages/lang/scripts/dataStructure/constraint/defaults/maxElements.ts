import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DArray from "@scripts/array";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const maxElementsConstraintKind = createKind("max-elements-constraint");

export interface MaxElementsConstraintDefinition<
	GenericMax extends number = number,
> extends ConstraintDefinition {
	readonly max: GenericMax;
}

export interface MaxElementsConstraint<
	GenericMax extends number = number,
> extends DCommon.Forward<
		& Constraint<
			readonly unknown[],
			readonly unknown[] & DArray.MaxElements<GenericMax>,
			MaxElementsConstraintDefinition<GenericMax>
		>
		& DKind.Kind<typeof maxElementsConstraintKind>
	> {
}

export const MaxElementsConstraint = createConstraint(
	maxElementsConstraintKind,
	({ init }) => <
		GenericMax extends number,
	>(max: GenericMax) => init<
		MaxElementsConstraint<GenericMax>
	>(
		{ max },
		{
			executeCheck: (self, data) => DArray.maxElements(
				data,
				DCommon.forward<number>(self.definition.max),
			)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

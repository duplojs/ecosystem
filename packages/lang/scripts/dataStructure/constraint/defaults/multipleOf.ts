import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DNumber from "@scripts/number";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const multipleOfConstraintKind = createKind("multiple-of-constraint");

export interface MultipleOfConstraintDefinition<
	GenericMultiple extends number = number,
> extends ConstraintDefinition {
	readonly multiple: GenericMultiple;
}

export interface MultipleOfConstraint<
	GenericMultiple extends number = number,
> extends DCommon.Forward<
		& Constraint<
			number,
			number & DNumber.MultipleOf<GenericMultiple>,
			MultipleOfConstraintDefinition<GenericMultiple>
		>
		& DKind.Kind<typeof multipleOfConstraintKind>
	> {
}

export const MultipleOfConstraint = createConstraint(
	multipleOfConstraintKind,
	({ init }) => <
		GenericMultiple extends number,
	>(multiple: GenericMultiple) => init<
		MultipleOfConstraint<GenericMultiple>
	>(
		{ multiple },
		{
			executeCheck: (self, data) => DNumber.isMultipleOf(
				data,
				DCommon.forward<number>(self.definition.multiple),
			)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

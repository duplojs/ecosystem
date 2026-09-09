import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DArray from "@scripts/array";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const arrayLengthEqualConstraintKind = createKind("array-length-equal-constraint");

export interface ArrayLengthEqualConstraintDefinition<
	GenericLength extends number = number,
> extends ConstraintDefinition {
	readonly length: GenericLength;
}

export interface ArrayLengthEqualConstraint<
	GenericLength extends number = number,
> extends DCommon.Forward<
		& Constraint<
			readonly unknown[],
			readonly unknown[] & DArray.LengthEqual<GenericLength>,
			ArrayLengthEqualConstraintDefinition<GenericLength>
		>
		& DKind.Kind<typeof arrayLengthEqualConstraintKind>
	> {
}

export const ArrayLengthEqualConstraint = createConstraint(
	arrayLengthEqualConstraintKind,
	({ init }) => <
		GenericLength extends number,
	>(length: GenericLength) => init<
		ArrayLengthEqualConstraint<GenericLength>
	>(
		{ length },
		{
			executeCheck: (self, data) => DArray.lengthEqual(
				data,
				DCommon.forward<number>(self.definition.length),
			)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DString from "@scripts/string";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const stringLengthEqualConstraintKind = createKind("string-length-equal-constraint");

export interface StringLengthEqualConstraintDefinition<
	GenericLength extends number = number,
> extends ConstraintDefinition {
	readonly length: GenericLength;
}

export interface StringLengthEqualConstraint<
	GenericLength extends number = number,
> extends DCommon.Forward<
		& Constraint<
			string,
			string & DString.LengthEqual<GenericLength>,
			StringLengthEqualConstraintDefinition<GenericLength>
		>
		& DKind.Kind<typeof stringLengthEqualConstraintKind>
	> {
}

export const StringLengthEqualConstraint = createConstraint(
	stringLengthEqualConstraintKind,
	({ init }) => <
		GenericLength extends number,
	>(length: GenericLength) => init<
		StringLengthEqualConstraint<GenericLength>
	>(
		{ length },
		{
			executeCheck: (self, data) => DString.lengthEqual(
				data,
				DCommon.forward<number>(self.definition.length),
			)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

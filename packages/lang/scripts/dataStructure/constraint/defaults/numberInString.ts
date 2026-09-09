import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DString from "@scripts/string";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const numberInStringConstraintKind = createKind("number-in-string-constraint");

export interface NumberInStringConstraintDefinition extends ConstraintDefinition { }

export interface NumberInStringConstraint extends DCommon.Forward<
	& Constraint<
		string,
		string & DString.Number,
		NumberInStringConstraintDefinition
	>
	& DKind.Kind<typeof numberInStringConstraintKind>
> {}

export const NumberInStringConstraint = createConstraint(
	numberInStringConstraintKind,
	({ init }) => () => init<NumberInStringConstraint>(
		{ },
		{
			executeCheck: (_self, data) => DString.isNumber(data)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

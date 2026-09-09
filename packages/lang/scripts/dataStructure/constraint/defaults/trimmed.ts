import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DString from "@scripts/string";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const trimmedConstraintKind = createKind("trimmed-constraint");

export interface TrimmedConstraintDefinition extends ConstraintDefinition {

}

export interface TrimmedConstraint extends DCommon.Forward<
	& Constraint<
		string,
		string & DString.Trimmed,
		TrimmedConstraintDefinition
	>
	& DKind.Kind<typeof trimmedConstraintKind>
> {}

export const TrimmedConstraint = createConstraint(
	trimmedConstraintKind,
	({ init }) => () => init<TrimmedConstraint>(
		{},
		{
			executeCheck: (_self, data) => DString.isTrimmed(data)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

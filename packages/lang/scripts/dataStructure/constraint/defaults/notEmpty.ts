import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DString from "@scripts/string";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const notEmptyConstraintKind = createKind("not-empty-constraint");

export interface NotEmptyConstraintDefinition extends ConstraintDefinition {

}

export interface NotEmptyConstraint extends DCommon.Forward<
	& Constraint<
		string,
		string & DString.NotEmpty,
		NotEmptyConstraintDefinition
	>
	& DKind.Kind<typeof notEmptyConstraintKind>
> {}

export const NotEmptyConstraint = createConstraint(
	notEmptyConstraintKind,
	({ init }) => () => init<NotEmptyConstraint>(
		{},
		{
			executeCheck: (_self, data) => DString.isNotEmpty(data)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

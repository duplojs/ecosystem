import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DString from "@scripts/string";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const emailConstraintKind = createKind("email-constraint");

export interface EmailConstraintDefinition extends ConstraintDefinition { }

export interface EmailConstraint extends DCommon.Forward<
	& Constraint<
		string,
		string & DString.Email,
		EmailConstraintDefinition
	>
	& DKind.Kind<typeof emailConstraintKind>
> {}

export const EmailConstraint = createConstraint(
	emailConstraintKind,
	({ init }) => () => init<EmailConstraint>(
		{ },
		{
			executeCheck: (_self, data) => DString.isEmail(data)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

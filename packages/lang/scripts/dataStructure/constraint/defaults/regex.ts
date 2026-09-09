import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DString from "@scripts/string";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const regexConstraintKind = createKind("regex-constraint");

export interface RegexConstraintDefinition extends ConstraintDefinition {
	readonly regex: RegExp;
}

export interface RegexConstraint extends DCommon.Forward<
	& Constraint<
		string,
		string,
		RegexConstraintDefinition
	>
	& DKind.Kind<typeof regexConstraintKind>
> {}

export const RegexConstraint = createConstraint(
	regexConstraintKind,
	({ init }) => (regex: RegExp) => init<RegexConstraint>(
		{ regex },
		{
			executeCheck: (self, data) => DString.test(
				data,
				self.definition.regex,
			)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

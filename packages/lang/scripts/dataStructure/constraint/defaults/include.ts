import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DString from "@scripts/string";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const includeConstraintKind = createKind("include-constraint");

export interface IncludeConstraintDefinition<
	GenericSearchString extends string = string,
> extends ConstraintDefinition {
	readonly searchString: GenericSearchString;
}

export interface IncludeConstraint<
	GenericSearchString extends string = string,
> extends DCommon.Forward<
		& Constraint<
			string,
			`${string}${GenericSearchString}${string}`,
			IncludeConstraintDefinition<GenericSearchString>
		>
		& DKind.Kind<typeof includeConstraintKind>
	> {
}

export const IncludeConstraint = createConstraint(
	includeConstraintKind,
	({ init }) => <
		GenericSearchString extends string,
	>(searchString: GenericSearchString) => init<
		IncludeConstraint<GenericSearchString>
	>(
		{ searchString },
		{
			executeCheck: (self, data) => DString.includes(
				data,
				self.definition.searchString,
			)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

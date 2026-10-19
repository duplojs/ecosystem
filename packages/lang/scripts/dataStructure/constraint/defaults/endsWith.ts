import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DString from "@scripts/string";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const endsWithConstraintKind = createKind("ends-with-constraint");

export interface EndsWithConstraintDefinition<
	GenericSearchString extends string = string,
> extends ConstraintDefinition {
	readonly searchString: GenericSearchString;
}

export interface EndsWithConstraint<
	GenericSearchString extends string = string,
> extends DCommon.Forward<
		& Constraint<
			string,
			`${string}${GenericSearchString}`,
			EndsWithConstraintDefinition<GenericSearchString>
		>
		& DKind.Kind<typeof endsWithConstraintKind>
	> {
}

export const EndsWithConstraint = createConstraint(
	endsWithConstraintKind,
	({ init }) => <
		GenericSearchString extends string,
	>(searchString: GenericSearchString) => init<
		EndsWithConstraint<GenericSearchString>
	>(
		{ searchString },
		{
			executeCheck: (self, data) => DString.endsWith(
				data,
				self.definition.searchString,
			)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

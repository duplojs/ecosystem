import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DString from "@scripts/string";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const startsWithConstraintKind = createKind("starts-with-constraint");

export interface StartsWithConstraintDefinition<
	GenericSearchString extends string = string,
> extends ConstraintDefinition {
	readonly searchString: GenericSearchString;
}

export interface StartsWithConstraint<
	GenericSearchString extends string = string,
> extends DCommon.Forward<
		& Constraint<
			string,
			`${GenericSearchString}${string}`,
			StartsWithConstraintDefinition<GenericSearchString>
		>
		& DKind.Kind<typeof startsWithConstraintKind>
	> {
}

export const StartsWithConstraint = createConstraint(
	startsWithConstraintKind,
	({ init }) => <
		GenericSearchString extends string,
	>(searchString: GenericSearchString) => init<
		StartsWithConstraint<GenericSearchString>
	>(
		{ searchString },
		{
			executeCheck: (self, data) => DString.startsWith(
				data,
				self.definition.searchString,
			)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

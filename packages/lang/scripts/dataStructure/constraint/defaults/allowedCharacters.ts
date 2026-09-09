import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DString from "@scripts/string";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const allowedCharactersConstraintKind = createKind("allowed-characters-constraint");

export interface AllowedCharactersConstraintDefinition<
	GenericCharactersRange extends DString.CharactersRange = DString.CharactersRange,
> extends ConstraintDefinition {
	readonly charactersRange: DCommon.MaybeArray<GenericCharactersRange>;
}

export interface AllowedCharactersConstraint<
	GenericCharactersRange extends DString.CharactersRange = DString.CharactersRange,
> extends DCommon.Forward<
		& Constraint<
			string,
			string & DString.AllowedCharacters<GenericCharactersRange>,
			AllowedCharactersConstraintDefinition<GenericCharactersRange>
		>
		& DKind.Kind<typeof allowedCharactersConstraintKind>
	> {
}

export const AllowedCharactersConstraint = createConstraint(
	allowedCharactersConstraintKind,
	({ init }) => <
		GenericCharactersRange extends DString.CharactersRange,
	>(charactersRange: DCommon.MaybeArray<GenericCharactersRange>) => init<
		AllowedCharactersConstraint<GenericCharactersRange>
	>(
		{ charactersRange },
		{
			executeCheck: (self, data) => DString.isComposedOf(
				data,
				self.definition.charactersRange,
			)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DString from "@scripts/string";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const maxCharactersConstraintKind = createKind("max-characters-constraint");

export interface MaxCharactersConstraintDefinition<
	GenericMax extends number = number,
> extends ConstraintDefinition {
	readonly max: GenericMax;
}

export interface MaxCharactersConstraint<
	GenericMax extends number = number,
> extends DCommon.Forward<
		& Constraint<
			string,
			string & DString.MaxCharacters<GenericMax>,
			MaxCharactersConstraintDefinition<GenericMax>
		>
		& DKind.Kind<typeof maxCharactersConstraintKind>
	> {
}

export const MaxCharactersConstraint = createConstraint(
	maxCharactersConstraintKind,
	({ init }) => <
		GenericMax extends number,
	>(max: GenericMax) => init<
		MaxCharactersConstraint<GenericMax>
	>(
		{ max },
		{
			executeCheck: (self, data) => DString.maxCharacters(
				data,
				DCommon.forward<number>(self.definition.max),
			)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DString from "@scripts/string";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const urlConstraintKind = createKind("url-constraint");

export interface UrlConstraintDefinition extends ConstraintDefinition { }

export interface UrlConstraint extends DCommon.Forward<
	& Constraint<
		string,
		string & DString.Url,
		UrlConstraintDefinition
	>
	& DKind.Kind<typeof urlConstraintKind>
> {}

export const UrlConstraint = createConstraint(
	urlConstraintKind,
	({ init }) => () => init<UrlConstraint>(
		{ },
		{
			executeCheck: (_self, data) => DString.isUrl(data)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

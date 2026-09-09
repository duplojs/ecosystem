import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DString from "@scripts/string";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const uuidConstraintKind = createKind("uuid-constraint");

export interface UuidConstraintDefinition extends ConstraintDefinition { }

export interface UuidConstraint extends DCommon.Forward<
	& Constraint<
		string,
		string & DString.Uuid,
		UuidConstraintDefinition
	>
	& DKind.Kind<typeof uuidConstraintKind>
> {}

export const UuidConstraint = createConstraint(
	uuidConstraintKind,
	({ init }) => () => init<UuidConstraint>(
		{ },
		{
			executeCheck: (_self, data) => DString.isUuid(data)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

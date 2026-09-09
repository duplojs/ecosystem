import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DPath from "@scripts/path";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const pathConstraintKind = createKind("path-constraint");

export interface PathConstraintDefinition extends ConstraintDefinition { }

export interface PathConstraint extends DCommon.Forward<
	& Constraint<
		string,
		string & DPath.Path,
		PathConstraintDefinition
	>
	& DKind.Kind<typeof pathConstraintKind>
> {}

export const PathConstraint = createConstraint(
	pathConstraintKind,
	({ init }) => () => init<PathConstraint>(
		{ },
		{
			executeCheck: (_self, data) => DPath.is(data)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

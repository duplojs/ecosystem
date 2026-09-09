import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DPath from "@scripts/path";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const absolutePathConstraintKind = createKind("absolute-path-constraint");

export interface AbsolutePathConstraintDefinition extends ConstraintDefinition { }

export interface AbsolutePathConstraint extends DCommon.Forward<
	& Constraint<
		string,
		string & DPath.Absolute,
		AbsolutePathConstraintDefinition
	>
	& DKind.Kind<typeof absolutePathConstraintKind>
> {}

export const AbsolutePathConstraint = createConstraint(
	absolutePathConstraintKind,
	({ init }) => () => init<AbsolutePathConstraint>(
		{ },
		{
			executeCheck: (_self, data) => DPath.isAbsolute(data)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DPath from "@scripts/path";
import { createKind } from "../../kind";
import { type ConstraintDefinition, createConstraint, type Constraint } from "../base";
import { ErrorSymbol, SuccessSymbol } from "../../common";

export const segmentPathConstraintKind = createKind("segment-path-constraint");

export interface SegmentPathConstraintDefinition extends ConstraintDefinition { }

export interface SegmentPathConstraint extends DCommon.Forward<
	& Constraint<
		string,
		string & DPath.Segment,
		SegmentPathConstraintDefinition
	>
	& DKind.Kind<typeof segmentPathConstraintKind>
> {}

export const SegmentPathConstraint = createConstraint(
	segmentPathConstraintKind,
	({ init }) => () => init<SegmentPathConstraint>(
		{ },
		{
			executeCheck: (_self, data) => DPath.isSegment(data)
				? SuccessSymbol
				: ErrorSymbol,
			isAsynchronous: () => false,
		},
	),
);

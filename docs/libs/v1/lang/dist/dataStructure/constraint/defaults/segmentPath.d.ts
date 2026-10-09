import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DPath from '../../../path';
export declare const segmentPathConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/segment-path-constraint", unknown>>;
export interface SegmentPathConstraintDefinition extends ConstraintDefinition {
}
export interface SegmentPathConstraint extends DCommon.Forward<Constraint<string, string & DPath.Segment, SegmentPathConstraintDefinition> & DKind.Kind<typeof segmentPathConstraintKind>> {
}
export declare const SegmentPathConstraint: () => SegmentPathConstraint;

import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DString from '../../../string';
export declare const trimmedConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/trimmed-constraint", unknown>>;
export interface TrimmedConstraintDefinition extends ConstraintDefinition {
}
export interface TrimmedConstraint extends DCommon.Forward<Constraint<string, string & DString.Trimmed, TrimmedConstraintDefinition> & DKind.Kind<typeof trimmedConstraintKind>> {
}
export declare const TrimmedConstraint: () => TrimmedConstraint;

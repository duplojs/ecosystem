import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DString from '../../../string';
export declare const notEmptyConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/not-empty-constraint", unknown>>;
export interface NotEmptyConstraintDefinition extends ConstraintDefinition {
}
export interface NotEmptyConstraint extends DCommon.Forward<Constraint<string, string & DString.NotEmpty, NotEmptyConstraintDefinition> & DKind.Kind<typeof notEmptyConstraintKind>> {
}
export declare const NotEmptyConstraint: () => NotEmptyConstraint;

import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DString from '../../../string';
export declare const numberInStringConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/number-in-string-constraint", unknown>>;
export interface NumberInStringConstraintDefinition extends ConstraintDefinition {
}
export interface NumberInStringConstraint extends DCommon.Forward<Constraint<string, string & DString.Number, NumberInStringConstraintDefinition> & DKind.Kind<typeof numberInStringConstraintKind>> {
}
export declare const NumberInStringConstraint: () => NumberInStringConstraint;

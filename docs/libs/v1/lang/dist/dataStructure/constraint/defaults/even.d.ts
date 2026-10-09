import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DNumber from '../../../number';
export declare const evenConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/even-constraint", unknown>>;
export interface EvenConstraintDefinition extends ConstraintDefinition {
}
export interface EvenConstraint extends DCommon.Forward<Constraint<number, number & DNumber.Even, EvenConstraintDefinition> & DKind.Kind<typeof evenConstraintKind>> {
}
export declare const EvenConstraint: () => EvenConstraint;

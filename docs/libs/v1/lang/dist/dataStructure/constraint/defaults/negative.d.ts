import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DNumber from '../../../number';
export declare const negativeConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/negative-constraint", unknown>>;
export interface NegativeConstraintDefinition extends ConstraintDefinition {
}
export interface NegativeConstraint extends DCommon.Forward<Constraint<number, number & DNumber.Negative, NegativeConstraintDefinition> & DKind.Kind<typeof negativeConstraintKind>> {
}
export declare const NegativeConstraint: () => NegativeConstraint;

import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DNumber from '../../../number';
export declare const safeConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/safe-constraint", unknown>>;
export interface SafeConstraintDefinition extends ConstraintDefinition {
}
export interface SafeConstraint extends DCommon.Forward<Constraint<number, number & DNumber.Safe, SafeConstraintDefinition> & DKind.Kind<typeof safeConstraintKind>> {
}
export declare const SafeConstraint: () => SafeConstraint;

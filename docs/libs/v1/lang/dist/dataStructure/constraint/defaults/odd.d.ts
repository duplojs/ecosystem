import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DNumber from '../../../number';
export declare const oddConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/odd-constraint", unknown>>;
export interface OddConstraintDefinition extends ConstraintDefinition {
}
export interface OddConstraint extends DCommon.Forward<Constraint<number, number & DNumber.Odd, OddConstraintDefinition> & DKind.Kind<typeof oddConstraintKind>> {
}
export declare const OddConstraint: () => OddConstraint;

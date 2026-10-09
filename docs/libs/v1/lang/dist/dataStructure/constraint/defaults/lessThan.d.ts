import { ConstraintDefinition, Constraint } from '../base';
import * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DNumber from '../../../number';
export declare const lessThanConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/less-than-constraint", unknown>>;
export interface LessThanConstraintDefinition<GenericThreshold extends number = number> extends ConstraintDefinition {
    readonly threshold: GenericThreshold;
}
export interface LessThanConstraint<GenericThreshold extends number = number> extends DCommon.Forward<Constraint<number, number & DNumber.LessThan<GenericThreshold>, LessThanConstraintDefinition<GenericThreshold>> & DKind.Kind<typeof lessThanConstraintKind>> {
}
export declare const LessThanConstraint: <GenericThreshold extends number>(threshold: GenericThreshold) => LessThanConstraint<GenericThreshold>;

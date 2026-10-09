import { ConstraintDefinition, Constraint } from '../base';
import * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DNumber from '../../../number';
export declare const multipleOfConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/multiple-of-constraint", unknown>>;
export interface MultipleOfConstraintDefinition<GenericMultiple extends number = number> extends ConstraintDefinition {
    readonly multiple: GenericMultiple;
}
export interface MultipleOfConstraint<GenericMultiple extends number = number> extends DCommon.Forward<Constraint<number, number & DNumber.MultipleOf<GenericMultiple>, MultipleOfConstraintDefinition<GenericMultiple>> & DKind.Kind<typeof multipleOfConstraintKind>> {
}
export declare const MultipleOfConstraint: <GenericMultiple extends number>(multiple: GenericMultiple) => MultipleOfConstraint<GenericMultiple>;

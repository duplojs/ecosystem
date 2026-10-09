import { ConstraintDefinition, Constraint } from '../base';
import * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DArray from '../../../array';
export declare const maxElementsConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/max-elements-constraint", unknown>>;
export interface MaxElementsConstraintDefinition<GenericMax extends number = number> extends ConstraintDefinition {
    readonly max: GenericMax;
}
export interface MaxElementsConstraint<GenericMax extends number = number> extends DCommon.Forward<Constraint<readonly unknown[], readonly unknown[] & DArray.MaxElements<GenericMax>, MaxElementsConstraintDefinition<GenericMax>> & DKind.Kind<typeof maxElementsConstraintKind>> {
}
export declare const MaxElementsConstraint: <GenericMax extends number>(max: GenericMax) => MaxElementsConstraint<GenericMax>;

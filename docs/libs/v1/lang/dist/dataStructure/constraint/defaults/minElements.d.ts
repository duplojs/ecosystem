import { ConstraintDefinition, Constraint } from '../base';
import * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import * as DArray from '../../../array';
export declare const minElementsConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/min-elements-constraint", unknown>>;
export interface MinElementsConstraintDefinition<GenericMin extends number = number> extends ConstraintDefinition {
    readonly min: GenericMin;
}
export interface MinElementsConstraint<GenericMin extends number = number> extends DCommon.Forward<Constraint<readonly unknown[], readonly unknown[] & DArray.MinElements<GenericMin>, MinElementsConstraintDefinition<GenericMin>> & DKind.Kind<typeof minElementsConstraintKind>> {
}
export declare const MinElementsConstraint: <GenericMin extends number>(min: GenericMin) => MinElementsConstraint<GenericMin>;

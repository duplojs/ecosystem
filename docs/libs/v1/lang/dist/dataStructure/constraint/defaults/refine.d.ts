import { ConstraintDefinition, Constraint } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
export declare const refineConstraintKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/refine-constraint", unknown>>;
export interface RefineConstraintDefinition<GenericInput extends unknown = unknown> extends ConstraintDefinition {
    refine(data: GenericInput): boolean;
}
export interface RefineConstraint<GenericInput extends unknown = unknown, GenericPredicate extends GenericInput = GenericInput> extends DCommon.Forward<Constraint<GenericInput, GenericPredicate, RefineConstraintDefinition<GenericInput>> & DKind.Kind<typeof refineConstraintKind>> {
}
export declare const RefineConstraint: <GenericInput extends unknown, GenericPredicate extends GenericInput = GenericInput>(refine: (((data: GenericInput) => data is GenericPredicate) | ((data: GenericInput) => boolean))) => RefineConstraint<GenericInput, GenericPredicate>;

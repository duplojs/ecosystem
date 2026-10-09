import { Typescript } from '../../typescript';
import { ImportKind, MapImportContext } from '../importContext';
import { ConstraintErrorEither, ConstraintTransformerEither, TransformerSuccessEither } from '../result';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export interface ConstraintTransformerParams {
    readonly importContext: MapImportContext;
    success(result: Typescript.TypeNode): TransformerSuccessEither;
    buildError(): ConstraintErrorEither;
    addImport(path: string, typeName: string, type?: ImportKind): void;
}
export type ConstraintTransformerBuildFunction<GenericConstraint extends DDataStructure.Constraint = DDataStructure.Constraint> = (constraint: GenericConstraint, params: ConstraintTransformerParams) => ConstraintTransformerEither;
export type ConstraintTransformer = (constraint: DDataStructure.Constraint, params: ConstraintTransformerParams) => ConstraintTransformerEither;
export declare function createConstraintTransformer<GenericConstraint extends DDataStructure.Constraint>(support: (constraint: DDataStructure.Constraint) => constraint is GenericConstraint, builder: ConstraintTransformerBuildFunction<GenericConstraint>): ConstraintTransformer;

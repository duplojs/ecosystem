import { Typescript } from '../../typescript';
import { ConstraintErrorEither, ConstraintTransformerEither, TransformerSuccessEither } from '../result';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import type * as DStoTS from '../../toTypescript';
export interface ConstraintTransformerParams {
    readonly importContext: DStoTS.MapImportContext;
    success(result: Typescript.CallExpression | Typescript.Identifier): TransformerSuccessEither;
    buildError(): ConstraintErrorEither;
    addImport(path: string, typeName: string, type?: DStoTS.ImportKind): void;
}
export type ConstraintTransformerBuildFunction<GenericConstraint extends DDataStructure.Constraint = DDataStructure.Constraint> = (constraint: GenericConstraint, params: ConstraintTransformerParams) => ConstraintTransformerEither;
export type ConstraintTransformer = (constraint: DDataStructure.Constraint, params: ConstraintTransformerParams) => ConstraintTransformerEither;
export declare function createConstraintTransformer<GenericConstraint extends DDataStructure.Constraint>(support: (constraint: DDataStructure.Constraint) => constraint is GenericConstraint, builder: ConstraintTransformerBuildFunction<GenericConstraint>): ConstraintTransformer;

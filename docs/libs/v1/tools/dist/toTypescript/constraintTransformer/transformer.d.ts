import { MapImportContext } from '../importContext';
import { ConstraintTransformer } from './create';
import { ConstraintTransformerEither } from '../result';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export interface ConstraintTransformerFunctionParams {
    readonly transformers: readonly ConstraintTransformer[];
    readonly importContext: MapImportContext;
}
export declare function constraintTransformer(constraint: DDataStructure.Constraint, params: ConstraintTransformerFunctionParams): ConstraintTransformerEither;

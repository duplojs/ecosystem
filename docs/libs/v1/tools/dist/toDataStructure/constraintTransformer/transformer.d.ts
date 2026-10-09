import { ConstraintTransformer } from './create';
import { ConstraintTransformerEither } from '../result';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DStoTS from '../../toTypescript';
export interface ConstraintTransformerFunctionParams {
    readonly transformers: readonly ConstraintTransformer[];
    readonly importContext: DStoTS.MapImportContext;
}
export declare function constraintTransformer(constraint: DDataStructure.Constraint, params: ConstraintTransformerFunctionParams): ConstraintTransformerEither;

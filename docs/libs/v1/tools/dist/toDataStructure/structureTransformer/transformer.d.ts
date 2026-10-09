import { DependenciesContext, MapContext, StructureTransformer } from './create';
import { ConstraintTransformer } from '../constraintTransformer';
import { TypeTransformer } from '../typeTransformer';
import { TransformerHook } from './hook';
import { TransformerEither } from '../result';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DStoTS from '../../toTypescript';
export interface StructureTransformerFunctionParams {
    readonly structureTransformers: readonly StructureTransformer[];
    readonly typeTransformers: readonly TypeTransformer[];
    readonly constraintTransformers: readonly ConstraintTransformer[];
    readonly context: MapContext;
    readonly dependenciesContext: DependenciesContext;
    readonly importContext: DStoTS.MapImportContext;
    readonly hooks: readonly TransformerHook[];
    readonly recursiveDataStructures: readonly DDataStructure.Structure[];
    readonly toTypescript: {
        readonly typeTransformers: readonly DStoTS.TypeTransformer[];
        readonly structureTransformers: readonly DStoTS.StructureTransformer[];
        readonly constraintTransformers: readonly DStoTS.ConstraintTransformer[];
        readonly context: DStoTS.MapContext;
        readonly importContext: DStoTS.MapImportContext;
    };
}
export declare function structureTransformer(structure: DDataStructure.Structure, params: StructureTransformerFunctionParams): TransformerEither;

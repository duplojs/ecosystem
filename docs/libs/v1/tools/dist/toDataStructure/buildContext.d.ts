import { ConstraintTransformer } from './constraintTransformer';
import { MapContext, StructureTransformer, TransformerHook } from './structureTransformer';
import { TypeTransformer } from './typeTransformer';
import { ConstraintErrorEither, ConstraintNotSupportedEither, DataStructureErrorEither, DataStructureNotSupportedEither, DataStructureTypeErrorEither, DataStructureTypeNotSupportedEither } from './result';
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DEither from "@duplojs-v1/lang/either";
import type * as DStoTS from '../toTypescript';
export interface BuildedContext {
    readonly context: MapContext;
    readonly toTypescript: {
        readonly context: DStoTS.MapContext;
        readonly importContext: DStoTS.MapImportContext;
    };
}
export interface BuildContextParams {
    readonly identifier: string;
    readonly structureTransformers: readonly StructureTransformer[];
    readonly typeTransformers: readonly TypeTransformer[];
    readonly constraintTransformers: readonly ConstraintTransformer[];
    readonly context?: MapContext;
    readonly hooks?: readonly TransformerHook[];
    readonly toTypescript: {
        readonly typeTransformers: readonly DStoTS.TypeTransformer[];
        readonly structureTransformers: readonly DStoTS.StructureTransformer[];
        readonly constraintTransformers: readonly DStoTS.ConstraintTransformer[];
        readonly context?: DStoTS.MapContext;
        readonly importContext?: DStoTS.MapImportContext;
    };
}
export declare function buildContext(structure: DDataStructure.Structure, params: BuildContextParams): (DEither.Success<BuildedContext> | DataStructureNotSupportedEither | DataStructureErrorEither | DataStructureTypeNotSupportedEither | DataStructureTypeErrorEither | ConstraintNotSupportedEither | ConstraintErrorEither);

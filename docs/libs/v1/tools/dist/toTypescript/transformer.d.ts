import { ConstraintTransformer } from './constraintTransformer';
import { MapContext } from './context';
import { MapImportContext } from './importContext';
import { TransformerEither } from './result';
import { StructureTransformer } from './structureTransformer';
import { TypeTransformer } from './typeTransformer';
import { TransformerHook } from './hook';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export interface TransformerFunctionParams {
    readonly identifier?: string;
    readonly structureTransformers: readonly StructureTransformer[];
    readonly typeTransformers: readonly TypeTransformer[];
    readonly constraintTransformers: readonly ConstraintTransformer[];
    readonly context: MapContext;
    readonly importContext: MapImportContext;
    readonly hooks: readonly TransformerHook[];
    readonly recursiveDataStructures: readonly DDataStructure.Structure[];
}
export declare function transformer(structure: DDataStructure.Structure, params: TransformerFunctionParams): TransformerEither;

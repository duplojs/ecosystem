import { MapContext } from './context';
import { TransformerHook } from './hook';
import { SupportedVersions, DataStructureTransformerEither } from './result';
import { StructureTransformer } from './structureTransformer';
import { TypeTransformer } from './typeTransformer';
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export interface TransformerFunctionParams {
    readonly identifier?: string;
    readonly structureTransformers: readonly StructureTransformer[];
    readonly typeTransformers: readonly TypeTransformer[];
    readonly context: MapContext;
    readonly hooks: readonly TransformerHook[];
    readonly version: SupportedVersions;
    readonly recursiveDataStructures: readonly DDataStructure.Structure[];
}
export declare function transformer(structure: DDataStructure.Structure, params: TransformerFunctionParams): DataStructureTransformerEither;
export declare function buildRef(name: string, version: SupportedVersions): string;

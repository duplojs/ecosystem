import { StructureTransformer, StructureTransformerParams } from './create';
import { TransformerEither } from '../result';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export interface StructureTransformerFunctionParams {
    readonly transformers: readonly StructureTransformer[];
    readonly transformerParams: StructureTransformerParams;
}
export declare function structureTransformer(structure: DDataStructure.Structure, params: StructureTransformerFunctionParams): TransformerEither;

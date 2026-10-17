import { StructureTransformer, StructureTransformerParams } from './create';
import { TransformerEither } from '../result';
import type * as DDataStructure from "@duplojs/lang/dataStructure";
export interface StructureTransformerFunctionParams {
    readonly transformers: readonly StructureTransformer[];
    readonly transformerParams: StructureTransformerParams;
}
export declare function structureTransformer(structure: DDataStructure.Structure, params: StructureTransformerFunctionParams): TransformerEither;

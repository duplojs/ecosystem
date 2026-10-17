import { TypeTransformer, TypeTransformerParams } from './create';
import { DataStructureTypeTransformerEither } from '../result';
import type * as DDataStructure from "@duplojs/lang/dataStructure";
export interface TypeTransformerFunctionParams {
    readonly transformers: readonly TypeTransformer[];
    readonly transformerParams: TypeTransformerParams;
}
export declare function typeTransformer(type: DDataStructure.Type, constraints: readonly DDataStructure.Constraint[], params: TypeTransformerFunctionParams): DataStructureTypeTransformerEither;

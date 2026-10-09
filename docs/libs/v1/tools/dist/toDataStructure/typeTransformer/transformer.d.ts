import { DataStructureTypeTransformerEither } from '../result';
import { TypeTransformer } from './create';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DStoTS from '../../toTypescript';
export interface TypeTransformerFunctionParams {
    readonly transformers: readonly TypeTransformer[];
    readonly importContext: DStoTS.MapImportContext;
}
export declare function typeTransformer(type: DDataStructure.Type, params: TypeTransformerFunctionParams): DataStructureTypeTransformerEither;

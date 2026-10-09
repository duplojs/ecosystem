import { Typescript } from '../../typescript';
import { ImportKind, MapImportContext } from '../importContext';
import { DataStructureTypeErrorEither, DataStructureTypeTransformerEither, TransformerSuccessEither } from '../result';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export interface TypeTransformerParams {
    readonly importContext: MapImportContext;
    success(result: Typescript.TypeNode): TransformerSuccessEither;
    buildError(): DataStructureTypeErrorEither;
    addImport(path: string, typeName: string, type?: ImportKind): void;
}
export type TypeTransformerBuildFunction<GenericType extends DDataStructure.Type = DDataStructure.Type> = (type: GenericType, params: TypeTransformerParams) => DataStructureTypeTransformerEither;
export type TypeTransformer = (type: DDataStructure.Type, params: TypeTransformerParams) => DataStructureTypeTransformerEither;
export declare function createTypeTransformer<GenericType extends DDataStructure.Type>(support: (type: DDataStructure.Type) => type is GenericType, builder: TypeTransformerBuildFunction<GenericType>): TypeTransformer;

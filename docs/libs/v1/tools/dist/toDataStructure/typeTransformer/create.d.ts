import { Typescript } from '../../typescript';
import { DataStructureTypeErrorEither, DataStructureTypeTransformerEither, TransformerSuccessEither } from '../result';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import type * as DStoTS from '../../toTypescript';
export interface TypeTransformerParams {
    readonly importContext: DStoTS.MapImportContext;
    success(result: Typescript.CallExpression | Typescript.Identifier): TransformerSuccessEither;
    buildError(): DataStructureTypeErrorEither;
    addImport(path: string, typeName: string, type?: DStoTS.ImportKind): void;
}
export type TypeTransformerBuildFunction<GenericType extends DDataStructure.Type = DDataStructure.Type> = (type: GenericType, params: TypeTransformerParams) => DataStructureTypeTransformerEither;
export type TypeTransformer = (type: DDataStructure.Types, params: TypeTransformerParams) => DataStructureTypeTransformerEither;
export declare function createTypeTransformer<GenericType extends DDataStructure.Type>(support: (type: DDataStructure.Type) => type is GenericType, builder: TypeTransformerBuildFunction<GenericType>): TypeTransformer;

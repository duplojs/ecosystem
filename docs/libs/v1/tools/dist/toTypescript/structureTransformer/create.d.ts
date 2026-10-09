import { Typescript } from '../../typescript';
import { MapContext } from '../context';
import { ImportKind, MapImportContext } from '../importContext';
import { ConstraintTransformerEither, DataStructureErrorEither, DataStructureTypeTransformerEither, TransformerEither, TransformerSuccessEither } from '../result';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export interface StructureTransformerParams {
    readonly context: MapContext;
    readonly importContext: MapImportContext;
    transformer(structure: DDataStructure.Structure): TransformerEither;
    success(result: Typescript.TypeNode): TransformerSuccessEither;
    transformType(type: DDataStructure.Type): DataStructureTypeTransformerEither;
    transformConstraint(constraint: DDataStructure.Constraint): ConstraintTransformerEither;
    buildError(): DataStructureErrorEither;
    addImport(path: string, typeName: string, type?: ImportKind): void;
}
export type StructureTransformerBuildFunction<GenericStructure extends DDataStructure.Structure = DDataStructure.Structure> = (structure: GenericStructure, params: StructureTransformerParams) => TransformerEither;
export type StructureTransformer = (structure: DDataStructure.Structure, params: StructureTransformerParams) => TransformerEither;
export declare function createStructureTransformer<GenericStructure extends DDataStructure.Structure>(support: (structure: DDataStructure.Structure) => structure is GenericStructure, builder: StructureTransformerBuildFunction<GenericStructure>): StructureTransformer;

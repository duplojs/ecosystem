import { Typescript } from '../../typescript';
import { ConstraintErrorEither, ConstraintNotSupportedEither, DataStructureErrorEither, DataStructureTypeTransformerEither, TransformerEither, TransformerSuccessEither } from '../result';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import type * as DStoTS from '../../toTypescript';
export type DependenciesContext = Set<DDataStructure.Structure>;
export interface MapContextValue {
    readonly identifier: Typescript.Identifier;
    readonly expression: Typescript.CallExpression | Typescript.Identifier;
    readonly typeIdentifier: Typescript.Identifier | null;
    readonly dependencies: DependenciesContext;
    readonly import: DStoTS.MapImportContext;
}
export type MapContext = Map<DDataStructure.Structure, MapContextValue>;
export interface StructureTransformerParams {
    readonly context: MapContext;
    readonly importContext: DStoTS.MapImportContext;
    transformer(structure: DDataStructure.Structure): TransformerEither;
    success(result: Typescript.CallExpression | Typescript.Identifier): TransformerSuccessEither;
    transformConstraint(constraint: DDataStructure.Constraint | readonly DDataStructure.Constraint[]): ((Typescript.CallExpression | Typescript.Identifier)[] | ConstraintNotSupportedEither | ConstraintErrorEither);
    transformType(type: DDataStructure.Type): DataStructureTypeTransformerEither;
    buildError(): DataStructureErrorEither;
    addImport(path: string, typeName: string, type?: DStoTS.ImportKind): void;
}
export type StructureTransformerBuildFunction<GenericStructure extends DDataStructure.Structure = DDataStructure.Structure> = (structure: GenericStructure, params: StructureTransformerParams) => TransformerEither;
export type StructureTransformer = (structure: DDataStructure.Structure, params: StructureTransformerParams) => TransformerEither;
export declare function createStructureTransformer<GenericStructure extends DDataStructure.Structure>(support: (structure: DDataStructure.Structure) => structure is GenericStructure, builder: StructureTransformerBuildFunction<GenericStructure>): StructureTransformer;

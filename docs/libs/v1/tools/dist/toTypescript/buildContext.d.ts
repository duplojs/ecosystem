import { ConstraintTransformer } from './constraintTransformer';
import { MapContext } from './context';
import { TransformerHook } from './hook';
import { MapImportContext } from './importContext';
import { ConstraintErrorEither, ConstraintNotSupportedEither, DataStructureErrorEither, DataStructureNotSupportedEither, DataStructureTypeErrorEither, DataStructureTypeNotSupportedEither } from './result';
import { StructureTransformer } from './structureTransformer';
import { TypeTransformer } from './typeTransformer';
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DEither from "@duplojs-v1/lang/either";
export interface BuiltContext {
    readonly context: MapContext;
    readonly importContext: MapImportContext;
}
export interface BuildContextParams {
    readonly identifier: string;
    readonly structureTransformers: readonly StructureTransformer[];
    readonly typeTransformers: readonly TypeTransformer[];
    readonly constraintTransformers: readonly ConstraintTransformer[];
    readonly context?: MapContext;
    readonly importContext?: MapImportContext;
    readonly hooks?: readonly TransformerHook[];
}
export declare function buildContext(structure: DDataStructure.Structure, params: BuildContextParams): (DEither.Right<"buildSuccess", BuiltContext> | DataStructureNotSupportedEither | DataStructureErrorEither | ConstraintNotSupportedEither | ConstraintErrorEither | DataStructureTypeNotSupportedEither | DataStructureTypeErrorEither);

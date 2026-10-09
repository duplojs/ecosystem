import { ConstraintErrorEither, ConstraintNotSupportedEither, DataStructureErrorEither, DataStructureNotSupportedEither, DataStructureTypeErrorEither, DataStructureTypeNotSupportedEither } from './result';
import { BuildContextParams } from './buildContext';
import * as DKind from "@duplojs-v1/lang/kind";
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
declare const DataStructureToDataStructureRenderError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangToolsDataStructureToDataStructure/data-structure-to-data-structure-render-error", unknown>>, ErrorConstructor>;
export declare class DataStructureToDataStructureRenderError extends DataStructureToDataStructureRenderError_base {
    structure: DDataStructure.Structure;
    error: (DataStructureNotSupportedEither | DataStructureErrorEither | DataStructureTypeNotSupportedEither | DataStructureTypeErrorEither | ConstraintNotSupportedEither | ConstraintErrorEither);
    constructor(structure: DDataStructure.Structure, error: (DataStructureNotSupportedEither | DataStructureErrorEither | DataStructureTypeNotSupportedEither | DataStructureTypeErrorEither | ConstraintNotSupportedEither | ConstraintErrorEither));
}
export interface RenderParams extends BuildContextParams {
}
export declare function render(structure: DDataStructure.Structure, params: RenderParams): string & import('@duplojs-v1/lang/string').Trimmed;
export {};

import { ConstraintErrorEither, ConstraintNotSupportedEither, DataStructureErrorEither, DataStructureNotSupportedEither, DataStructureTypeErrorEither, DataStructureTypeNotSupportedEither } from './result';
import { BuildContextParams } from './buildContext';
import * as DKind from "@duplojs/lang/kind";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
declare const DataStructureToDataStructureRenderError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangToolsDataStructureToDataStructure/data-structure-to-data-structure-render-error", unknown>>, ErrorConstructor>;
export declare class DataStructureToDataStructureRenderError extends DataStructureToDataStructureRenderError_base {
    structure: DDataStructure.Structure;
    error: (DataStructureNotSupportedEither | DataStructureErrorEither | DataStructureTypeNotSupportedEither | DataStructureTypeErrorEither | ConstraintNotSupportedEither | ConstraintErrorEither);
    constructor(structure: DDataStructure.Structure, error: (DataStructureNotSupportedEither | DataStructureErrorEither | DataStructureTypeNotSupportedEither | DataStructureTypeErrorEither | ConstraintNotSupportedEither | ConstraintErrorEither));
}
export interface RenderParams extends BuildContextParams {
}
export declare function render(structure: DDataStructure.Structure, params: RenderParams): string & import('@duplojs/lang/string').Trimmed;
export {};

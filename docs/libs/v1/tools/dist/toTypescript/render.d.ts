import { BuildContextParams } from './buildContext';
import { TransformerEither } from './result';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DEither from "@duplojs-v1/lang/either";
import * as DKind from "@duplojs-v1/lang/kind";
export interface RenderParams extends BuildContextParams {
}
declare const DataStructureToTypescriptRenderError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangToolsDataStructureToTypescript/data-structure-to-typescript-render-error", unknown>>, ErrorConstructor>;
export declare class DataStructureToTypescriptRenderError extends DataStructureToTypescriptRenderError_base {
    structure: DDataStructure.Structure;
    error: Extract<TransformerEither, DEither.Left>;
    constructor(structure: DDataStructure.Structure, error: Extract<TransformerEither, DEither.Left>);
}
export declare function render(structure: DDataStructure.Structure, params: RenderParams): string;
export {};

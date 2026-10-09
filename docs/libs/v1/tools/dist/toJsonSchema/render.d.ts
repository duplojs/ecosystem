import { DataStructureTransformerEither, JsonSchema, MapperSupportedVersions, SupportedVersions } from './result';
import { MapContext } from './context';
import { StructureTransformer } from './structureTransformer';
import { TypeTransformer } from './typeTransformer';
import { TransformerHook } from './hook';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DEither from "@duplojs-v1/lang/either";
import type * as DCommon from "@duplojs-v1/lang/common";
import * as DKind from "@duplojs-v1/lang/kind";
export interface RenderParams<GenericVersion extends SupportedVersions = SupportedVersions> {
    readonly identifier: string;
    readonly structureTransformers: readonly StructureTransformer[];
    readonly typeTransformers: readonly TypeTransformer[];
    readonly context?: MapContext;
    readonly hooks?: readonly TransformerHook[];
    readonly version: GenericVersion;
}
declare const DataStructureToJsonSchemaRenderError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangToolsDataStructureToJsonSchema/data-structure-to-json-schema-render-error", unknown>>, ErrorConstructor>;
export declare class DataStructureToJsonSchemaRenderError extends DataStructureToJsonSchemaRenderError_base {
    structure: DDataStructure.Structure;
    error: Extract<DataStructureTransformerEither, DEither.Left>;
    constructor(structure: DDataStructure.Structure, error: Extract<DataStructureTransformerEither, DEither.Left>);
}
type RenderResult<GenericVersion extends SupportedVersions> = DCommon.Or<[
    DCommon.IsEqual<GenericVersion, "openApi3">,
    DCommon.IsEqual<GenericVersion, "openApi31">
]> extends true ? {
    $ref: `#/components/schemas/${string}`;
    openapi: MapperSupportedVersions[GenericVersion];
    components: {
        schemas: Record<string, JsonSchema>;
    };
} : DCommon.Or<[
    DCommon.IsEqual<GenericVersion, "jsonSchema7">,
    DCommon.IsEqual<GenericVersion, "jsonSchema4">
]> extends true ? {
    $ref: `#/$defs/${string}`;
    $schema: MapperSupportedVersions[GenericVersion];
    definitions: Record<string, JsonSchema>;
} : DCommon.IsEqual<GenericVersion, "jsonSchema202012"> extends true ? {
    $ref: `#/definitions/${string}`;
    $schema: MapperSupportedVersions[GenericVersion];
    $defs: Record<string, JsonSchema>;
} : never;
export declare function render<GenericVersion extends SupportedVersions>(structure: DDataStructure.Structures, params: RenderParams<GenericVersion>): RenderResult<GenericVersion>;
export {};

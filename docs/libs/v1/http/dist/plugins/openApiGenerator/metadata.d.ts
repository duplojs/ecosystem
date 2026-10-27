import { OpenApiEndpointContract } from './types';
import type * as DCommon from "@duplojs/lang/common";
export declare const IgnoreByOpenApiGeneratorMetadata: import('../../core/metadata').MetadataHandler<"ignore-by-open-api-generator", unknown>;
export declare const OpenApiEndpointContractMetadata: import('../../core/metadata').MetadataHandler<"open-api-endpoint-contract", DCommon.MaybeArray<OpenApiEndpointContract>>;
export declare const defaultExtractEndpointContractMetadata: import('../../core/metadata').Metadata<"open-api-endpoint-contract", {
    code: "422";
    information: string;
}>;

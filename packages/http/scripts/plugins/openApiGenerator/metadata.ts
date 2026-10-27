import { createMetadata } from "@core/metadata";
import { type OpenApiEndpointContract } from "./types";
import type * as DCommon from "@duplojs/lang/common";

export const IgnoreByOpenApiGeneratorMetadata = createMetadata("ignore-by-open-api-generator");

export const OpenApiEndpointContractMetadata = createMetadata<
	"open-api-endpoint-contract",
	DCommon.MaybeArray<OpenApiEndpointContract>
>("open-api-endpoint-contract");

export const defaultExtractEndpointContractMetadata = OpenApiEndpointContractMetadata({
	code: "422",
	information: "extract-error",
});

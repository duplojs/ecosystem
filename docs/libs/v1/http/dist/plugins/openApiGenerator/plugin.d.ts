import { HubPlugin } from '../../core/hub';
import { RoutePath } from '../../core/route';
import { SupportedBearerFormat } from './types';
import { OpenApiEndpointContractMetadata } from './metadata';
import type * as DPath from "@duplojs/lang/path";
interface OpenApiSecurityOptionBearer {
    type: "bearer";
    bearerFormat?: SupportedBearerFormat;
}
interface OpenApiSecurityOptionApiKey {
    type: "apiKey";
    paramName: string;
    in: "header" | "query" | "cookie";
}
interface OpenApiSecurityOptionBasic {
    type: "basic";
}
export interface OpenApiGeneratorPluginParams {
    readonly defaultExtractMetadata?: ReturnType<typeof OpenApiEndpointContractMetadata>;
    readonly routePath?: RoutePath;
    readonly outputFile?: DPath.AnyPath;
    /**
     * @default "Swagger API"
     */
    readonly title?: string;
    /**
     * @default "0.0.0"
     */
    readonly version?: string;
    readonly summary?: string;
    readonly contact?: {
        readonly name?: string;
        readonly email?: string;
        readonly url?: string;
    };
    readonly license?: {
        readonly name: string;
        readonly url?: string;
        readonly identifier?: string;
    };
    readonly security?: OpenApiSecurityOptionBearer | OpenApiSecurityOptionApiKey | OpenApiSecurityOptionBasic;
    readonly servers?: {
        readonly url: string;
        readonly description?: string;
    }[];
    /**
     * @default "5.31.0"
     */
    readonly swaggerUiVersion?: string;
}
export declare function openApiGeneratorPlugin(pluginParams: OpenApiGeneratorPluginParams): () => HubPlugin;
export {};

import { Route } from '../../core/route';
import { ResponseContract } from '../../core/response';
import { DataStructureToJsonSchema } from '@duplojs-v1/tools';
import { EndpointResponse, EntrypointParameter } from './types';
import * as DArray from "@duplojs-v1/lang/array";
export type ResultSchemaContext = Map<string, Record<string, DataStructureToJsonSchema.JsonSchema>>;
export interface RouteToOpenApiParams {
    readonly contextToJsonSchemaFactory: DataStructureToJsonSchema.MapContext;
    readonly resultSchemaContext: ResultSchemaContext;
    readonly defaultExtractContract: ResponseContract.Contract;
}
export declare function routeToOpenApi(route: Route, params: RouteToOpenApiParams): never[] | (readonly {
    path: `/${string}`;
    method: "get" | "post" | "put" | "patch" | "delete" | "head" | "trace" | "connect" | "options";
    parameters: readonly EntrypointParameter[];
    requestBody: {
        required: true;
        content: {
            "multipart/form-data": {
                schema: {
                    $ref: `#/components/schemas/${string}`;
                };
            };
        };
    } | {
        required: true;
        content: {
            "application/json": {
                schema: {
                    $ref: `#/components/schemas/${string}`;
                };
            };
        };
    } | {
        required: true;
        content: {
            "text/plain": {
                schema: {
                    $ref: `#/components/schemas/${string}`;
                };
            };
        };
    } | undefined;
    responses: Partial<Record<string, EndpointResponse>>;
}[] & DArray.MinElements<1>);

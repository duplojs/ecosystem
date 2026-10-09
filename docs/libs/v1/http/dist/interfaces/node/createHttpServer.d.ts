import { Hub } from '../../core/hub';
import { default as http } from 'node:http';
import { default as https } from 'node:https';
import { HttpServerParams } from '../../core/types';
import * as DObject from "@duplojs-v1/lang/object";
declare module '../../core/types' {
    interface HttpServerParams {
        readonly interface: "node";
        readonly http?: http.ServerOptions;
        readonly https?: https.ServerOptions;
    }
    interface HostCustom {
        "::": true;
        "0.0.0.0": true;
        localhost: true;
        "127.0.0.1": true;
        "::1": true;
    }
}
export type CreateHttpServerParams = DObject.PartialKeys<Omit<HttpServerParams, "interface">, "maxBodySize" | "informationHeaderKey" | "predictedHeaderKey" | "fromHookHeaderKey" | "uploadFolder">;
export declare function createHttpServer(hub: Hub, params: CreateHttpServerParams): Promise<https.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>>;

import { default as http } from 'http';
import * as DEither from "@duplojs-v1/lang/either";
export interface ReadRequestTextParams {
    maxBodySize: number;
}
export declare function readRequestText<GenericOutputValue extends unknown = string>(request: http.IncomingMessage, params: ReadRequestTextParams, onEnd?: (result: string) => GenericOutputValue): Promise<DEither.Left<"server-error", unknown> | DEither.Left<"reader-error", Error> | GenericOutputValue>;

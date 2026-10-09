import { default as http } from 'http';
import * as DCommon from "@duplojs-v1/lang/common";
import * as DEither from "@duplojs-v1/lang/either";
import * as DPath from "@duplojs-v1/lang/path";
interface HeaderPartInformation {
    name: string;
    filename?: string & DPath.Segment;
}
export interface ReadRequestFormDataStreamChunkEvent<GenericValueAccumulator extends unknown = unknown> {
    onReceiveChunk(chunk: Buffer): DCommon.MaybePromise<void>;
    onEndPart(valueAccumulator: GenericValueAccumulator): DCommon.MaybePromise<GenericValueAccumulator>;
    onError: ((error: unknown, valueAccumulator: GenericValueAccumulator) => DCommon.MaybePromise<void>) | null;
}
export interface ReadRequestFormDataParams {
    maxBodySize: number;
    maxFileQuantity: number;
    maxBufferSize: number;
    maxKeyLength: number;
    fileMaxSize: number;
    textFieldMaxSize: number;
    mimeType?: RegExp;
}
export declare function readRequestFormData<GenericValueAccumulator extends unknown, GenericOutputHeader extends DEither.Left = never>(request: http.IncomingMessage, firstValueAccumulator: GenericValueAccumulator, params: ReadRequestFormDataParams, onReceiveHeader: (header: HeaderPartInformation) => DCommon.MaybePromise<ReadRequestFormDataStreamChunkEvent<GenericValueAccumulator> | Error>): Promise<DEither.Left<"server-error", unknown> | GenericOutputHeader | DEither.Left<"reader-error", Error> | GenericValueAccumulator>;
export {};

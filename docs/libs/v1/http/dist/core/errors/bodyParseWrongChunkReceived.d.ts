import * as DKind from "@duplojs-v1/lang/kind";
declare const BodyParseWrongChunkReceived_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsHttpCore/body-parse-wrong-chunk-received", unknown>>, ErrorConstructor>;
export declare class BodyParseWrongChunkReceived extends BodyParseWrongChunkReceived_base {
    information: string;
    wrongChunk: unknown;
    constructor(information: string, wrongChunk: unknown);
}
export {};

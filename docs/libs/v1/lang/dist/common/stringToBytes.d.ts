import * as DKind from '../kind';
declare const InvalidBytesInStringError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangCommon/invalid-bytes-in-string-error", unknown>>, ErrorConstructor>;
export declare class InvalidBytesInStringError extends InvalidBytesInStringError_base {
    input: string;
    constructor(input: string);
}
declare const unitMapper: {
    b: number;
    kb: number;
    mb: number;
    gb: number;
    tb: number;
    pb: number;
};
export type BytesInString = `${number}${keyof typeof unitMapper}`;
export declare function stringToBytes(bytesInString: BytesInString | number): number;
export {};

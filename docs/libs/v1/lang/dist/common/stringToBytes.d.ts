import { DuploJSError } from './error';
declare const InvalidBytesInStringError_base: abstract new (error: string) => DuploJSError<"common-invalid-bytes-in-string-error", string> & import('../kind').Kind<import('../kind').Handler<import('../kind').Definition<"@DuplojsLangCommon/duplojs-error-common-invalid-bytes-in-string-error", unknown>>, unknown>;
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

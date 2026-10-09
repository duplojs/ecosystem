import { DuploJSError } from './error';
declare const InvalidMillisecondInStringError_base: abstract new (error: string) => DuploJSError<"common-invalid-millisecond-in-string-error", string> & import('../kind').Kind<import('../kind').Handler<import('../kind').Definition<"@DuplojsLangCommon/duplojs-error-common-invalid-millisecond-in-string-error", unknown>>, unknown>;
export declare class InvalidMillisecondInStringError extends InvalidMillisecondInStringError_base {
    input: string;
    constructor(input: string);
}
declare const unitMapper: {
    ms: number;
    s: number;
    m: number;
    h: number;
    d: number;
    w: number;
};
export type TimeInString = `${number}${keyof typeof unitMapper}`;
export declare function stringToMillisecond(millisecondInString: TimeInString | number, ...millisecondInStrings: (TimeInString | number)[]): number;
export {};

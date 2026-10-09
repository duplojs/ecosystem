import * as DKind from '../kind';
declare const InvalidMillisecondInStringError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsLangCommon/invalid-millisecond-in-string-error", unknown>>, ErrorConstructor>;
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

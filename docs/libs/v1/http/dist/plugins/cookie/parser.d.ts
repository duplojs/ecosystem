export declare function findPairEndIndex(value: string, start: number, len: number): number;
export declare function sliceAndTrimOws(value: string, min: number, max: number): string;
export declare function decode(value: string): string;
export declare function defaultParser(value: string): Partial<Record<string, string>>;
export type Parser = typeof defaultParser;

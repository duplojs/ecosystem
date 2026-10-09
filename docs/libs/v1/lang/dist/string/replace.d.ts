export interface StringReplacerParams<GenericString extends string = string> {
    matchedValue: string;
    groups: (string | undefined)[];
    namedGroups: Record<string, string | undefined>;
    offset: number;
    self: GenericString;
}
export type StringReplacer<GenericString extends string = string> = (params: StringReplacerParams<GenericString>) => string;
export declare function replace<GenericString extends string>(pattern: string | RegExp, replacement: string | StringReplacer<GenericString>): (string: GenericString) => string;
export declare function replace<GenericString extends string>(string: GenericString, pattern: string | RegExp, replacement: string | StringReplacer<GenericString>): string;

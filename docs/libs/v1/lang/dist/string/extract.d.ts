export interface ExtractOutput<GenericString extends string = string> {
    matchedValue: string;
    groups: string[];
    namedGroups: Record<string, string | undefined>;
    offset: number;
    self: GenericString;
}
export declare function extract<GenericString extends string>(pattern: string | RegExp): (string: GenericString) => ExtractOutput<GenericString> | undefined;
export declare function extract<GenericString extends string>(string: GenericString, pattern: string | RegExp): ExtractOutput<GenericString> | undefined;

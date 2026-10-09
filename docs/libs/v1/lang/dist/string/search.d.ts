export declare function search<GenericString extends string>(pattern: string | RegExp): (string: GenericString) => number | undefined;
export declare function search<GenericString extends string>(string: GenericString, pattern: string | RegExp): number | undefined;

export declare function isIn<GenericValue extends string>(array: readonly (GenericValue | string)[]): (string: string) => string is GenericValue;
export declare function isIn<GenericValue extends string>(string: string, array: readonly (GenericValue | string)[]): string is GenericValue;

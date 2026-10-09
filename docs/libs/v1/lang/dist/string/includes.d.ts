import { ApplyFormat } from './constraints';
type IncludesOutput<GenericString extends string, GenericSearchString extends string> = GenericString extends string ? ApplyFormat<GenericString> extends `${string}${GenericSearchString}${string}` ? GenericString : GenericString & `${string}${GenericSearchString}${string}` : never;
export declare function includes<GenericString extends string, GenericSearchString extends string>(searchString: GenericSearchString): (string: GenericString) => string is IncludesOutput<GenericString, GenericSearchString>;
export declare function includes<GenericString extends string, GenericSearchString extends string>(string: GenericString, searchString: GenericSearchString): string is IncludesOutput<GenericString, GenericSearchString>;
export {};

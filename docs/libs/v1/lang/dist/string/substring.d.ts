import { ReapplyAllowedCharacters, ReapplyCompatiblesConstraints } from './constraints';
type SubstringOutput<GenericString extends string> = GenericString extends unknown ? ReapplyAllowedCharacters<GenericString, ReapplyCompatiblesConstraints<GenericString, string, "maxCharacters">> : never;
export declare function substring<GenericString extends string>(start: number, end?: number): (string: GenericString) => SubstringOutput<GenericString>;
export declare function substring<GenericString extends string>(string: GenericString, start: number, end?: number): SubstringOutput<GenericString>;
export {};

import { ReapplyAllowedCharacters, ReapplyCompatiblesConstraints } from './constraints';
type SliceOutput<GenericString extends string> = GenericString extends unknown ? ReapplyAllowedCharacters<GenericString, ReapplyCompatiblesConstraints<GenericString, string, "maxCharacters">> : never;
export declare function slice<GenericString extends string>(start: number, end: number): (string: GenericString) => SliceOutput<GenericString>;
export declare function slice<GenericString extends string>(string: GenericString, start: number, end: number): SliceOutput<GenericString>;
export {};

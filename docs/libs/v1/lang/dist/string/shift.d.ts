import { ReapplyCompatiblesConstraints } from './constraints';
type ShiftOutput<GenericString extends string> = GenericString extends unknown ? ReapplyCompatiblesConstraints<GenericString, string, "maxCharacters"> : never;
export declare function shift<GenericString extends string>(string: GenericString): ShiftOutput<GenericString>;
export {};

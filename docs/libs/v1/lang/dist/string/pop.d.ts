import { ReapplyCompatiblesConstraints } from './constraints';
type PopOutput<GenericString extends string> = GenericString extends unknown ? ReapplyCompatiblesConstraints<GenericString, string, "maxCharacters"> : never;
export declare function pop<GenericString extends string>(string: GenericString): PopOutput<GenericString>;
export {};

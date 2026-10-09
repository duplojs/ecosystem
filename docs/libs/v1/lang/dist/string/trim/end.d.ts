import { ReapplyCompatiblesConstraints } from '../constraints';
type TrimEndOutput<GenericString extends string> = GenericString extends unknown ? ReapplyCompatiblesConstraints<GenericString, string, "maxCharacters"> : never;
export declare function trimEnd<GenericString extends string>(string: GenericString): TrimEndOutput<GenericString>;
export {};

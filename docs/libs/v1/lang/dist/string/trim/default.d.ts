import { ReapplyCompatiblesConstraints, Trimmed } from '../constraints';
type TrimOutput<GenericString extends string> = GenericString extends unknown ? ReapplyCompatiblesConstraints<GenericString, string & Trimmed, "maxCharacters"> : never;
export declare function trim<GenericString extends string>(string: GenericString): TrimOutput<GenericString>;
export {};

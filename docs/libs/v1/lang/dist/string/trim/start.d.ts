import { ReapplyCompatiblesConstraints } from '../constraints';
type TrimStartOutput<GenericString extends string> = GenericString extends unknown ? ReapplyCompatiblesConstraints<GenericString, string, "maxCharacters"> : never;
export declare function trimStart<GenericString extends string>(string: GenericString): TrimStartOutput<GenericString>;
export {};

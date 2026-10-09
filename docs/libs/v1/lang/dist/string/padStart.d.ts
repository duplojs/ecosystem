import { ReapplyCompatiblesConstraints } from './constraints';
import type * as DNumber from '../number';
type PadStartOutput<GenericString extends string> = GenericString extends unknown ? ReapplyCompatiblesConstraints<GenericString, string, "minCharacters"> : never;
export declare function padStart<GenericString extends string, GenericTargetLength extends number>(targetLength: GenericTargetLength & DNumber.RequirePositiveInteger<GenericTargetLength>, padString: string): (string: GenericString) => PadStartOutput<GenericString>;
export declare function padStart<GenericString extends string, GenericTargetLength extends number>(string: GenericString, targetLength: GenericTargetLength & DNumber.RequirePositiveInteger<GenericTargetLength>, padString: string): PadStartOutput<GenericString>;
export {};

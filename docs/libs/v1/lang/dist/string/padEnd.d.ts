import { ReapplyCompatiblesConstraints } from './constraints';
import type * as DNumber from '../number';
type PadEndOutput<GenericString extends string> = GenericString extends unknown ? ReapplyCompatiblesConstraints<GenericString, string, "minCharacters"> : never;
export declare function padEnd<GenericString extends string, GenericTargetLength extends number>(targetLength: GenericTargetLength & DNumber.RequirePositiveInteger<GenericTargetLength>, padString: string): (string: GenericString) => PadEndOutput<GenericString>;
export declare function padEnd<GenericString extends string, GenericTargetLength extends number>(string: GenericString, targetLength: GenericTargetLength & DNumber.RequirePositiveInteger<GenericTargetLength>, padString: string): PadEndOutput<GenericString>;
export {};

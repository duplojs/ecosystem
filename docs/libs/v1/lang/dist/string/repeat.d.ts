import { ReapplyAllowedCharacters } from './constraints';
import type * as DNumber from '../number';
type RepeatOutput<GenericString extends string> = ReapplyAllowedCharacters<GenericString, string>;
export declare function repeat<GenericString extends string, GenericCount extends number>(count: GenericCount & DNumber.RequirePositiveInteger<GenericCount>): (string: GenericString) => RepeatOutput<GenericString>;
export declare function repeat<GenericString extends string, GenericCount extends number>(string: GenericString, count: GenericCount & DNumber.RequirePositiveInteger<GenericCount>): RepeatOutput<GenericString>;
export {};

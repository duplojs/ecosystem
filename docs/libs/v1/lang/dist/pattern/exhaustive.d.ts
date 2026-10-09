import { patternResultKind } from './kind';
import { PatternResult } from './result';
import type * as DKind from '../kind';
export declare function exhaustive<const GenericValue extends unknown, GenericResult extends PatternResult<GenericValue>>(result: GenericResult): DKind.GetValue<typeof patternResultKind, GenericResult>;

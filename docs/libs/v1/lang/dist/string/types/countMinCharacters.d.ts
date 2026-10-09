import { Split } from './split';
import type * as DTuple from '../../tuple';
import type * as DCommon from '../../common';
export type CountMinCharacters<GenericString extends string> = string extends GenericString ? number : GenericString extends "" ? 0 : Split<GenericString, ""> extends infer InferredResult ? InferredResult extends DCommon.AnyTuple ? DTuple.CountMinElement<InferredResult> : number : never;

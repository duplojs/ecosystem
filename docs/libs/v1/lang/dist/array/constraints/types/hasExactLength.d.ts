import { ExtractLengthEqual, LengthEqual } from '../lengthEqual';
import type * as DCommon from '../../../common';
export type HasExactLength<GenericArray extends readonly unknown[], GenericLength extends number> = ExtractLengthEqual<GenericArray, unknown> extends LengthEqual<infer InferredLength> ? DCommon.IsEqual<InferredLength, GenericLength> : false;

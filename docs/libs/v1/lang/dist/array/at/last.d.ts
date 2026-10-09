import { ExtractLengthEqual, ExtractMinElements, LengthEqual, MinElements } from '../constraints';
import type * as DCommon from '../../common';
type ComputeLastOutputFromMinElements<GenericArray extends readonly unknown[]> = ExtractMinElements<GenericArray, unknown> extends MinElements<infer InferredMin> ? DCommon.Not<DCommon.IsEqual<InferredMin, 0>> extends true ? GenericArray[number] : GenericArray[number] | undefined : GenericArray[number] | undefined;
export type Last<GenericArray extends readonly unknown[]> = GenericArray extends readonly [...unknown[], infer InferredLast] ? InferredLast : ExtractLengthEqual<GenericArray, unknown> extends LengthEqual<infer InferredLength> ? DCommon.Not<DCommon.IsEqual<InferredLength, 0>> extends true ? GenericArray[number] : undefined : ComputeLastOutputFromMinElements<GenericArray>;
export declare function last<GenericArray extends readonly unknown[]>(array: GenericArray): Last<GenericArray>;
export {};

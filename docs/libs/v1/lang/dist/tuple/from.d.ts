import { Create } from './types';
import type * as DArray from '../array';
type FromOutput<GenericArray extends readonly unknown[]> = DArray.ExtractLengthEqual<GenericArray, unknown> extends DArray.LengthEqual<infer InferredLength extends number> ? DArray.ReapplyCompatiblesConstraints<GenericArray, Create<GenericArray[number], InferredLength>, "maxElements"> : DArray.ExtractMinElements<GenericArray, unknown> extends DArray.MinElements<infer InferredMin extends number> ? DArray.ReapplyCompatiblesConstraints<GenericArray, readonly [
    ...Create<GenericArray[number], InferredMin>,
    ...GenericArray[number][]
], "maxElements"> : GenericArray;
export declare function from<GenericArray extends readonly unknown[]>(source: GenericArray): FromOutput<GenericArray>;
export {};

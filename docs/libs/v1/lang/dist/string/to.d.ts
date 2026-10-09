import { Number } from './constraints';
import type * as DNumber from '../number';
type Stringifyable = (null | undefined | {
    toString(): string;
});
type ComputeResult<GenericValue extends Stringifyable> = GenericValue extends number ? DNumber.IsLiteral<GenericValue> extends true ? `${GenericValue}` : string & Number : GenericValue extends (string | boolean | null | undefined | bigint) ? `${GenericValue}` : GenericValue extends {
    toString(): string;
} ? ReturnType<GenericValue["toString"]> : never;
export declare function to<GenericValue extends Stringifyable>(value: GenericValue): ComputeResult<GenericValue>;
export {};

import { Constraint } from '../constraint';
import { TypeStructure, UnionStructure } from '../structure';
import type * as DCommon from '../../common';
export type LiteralValue = string | number | bigint | boolean | undefined | null;
export declare function literal<const GenericValue extends LiteralValue | DCommon.AnyTuple<LiteralValue>, const GenericConstraints extends readonly Constraint<GenericValue extends readonly unknown[] ? GenericValue[number] : GenericValue>[] = readonly []>(values: GenericValue, constraints?: GenericConstraints): GenericValue extends readonly unknown[] ? UnionStructure<GenericValue[number], GenericConstraints> : TypeStructure<GenericValue, Extract<GenericConstraints, readonly Constraint<GenericValue>[]>>;

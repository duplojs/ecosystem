import { ConstraintValue, Constraint } from '../../constraint';
import type * as DCommon from '../../../common';
export type StructureConstraintsValue<GenericConstraints extends Constraint> = DCommon.IsNever<GenericConstraints> extends true ? unknown : DCommon.NeverCoalescing<Extract<DCommon.UnionToIntersection<GenericConstraints extends Constraint ? {
    value: ConstraintValue<GenericConstraints>;
} : never>, {
    value: unknown;
}>["value"], unknown>;

import { RequireLiteral } from './requireLiteral';
import type * as DCommon from '../../common';
export type RequireSimpleLiteral<GenericString extends string> = GenericString extends DCommon.BaseConstraint ? DCommon.ComputedTypeError<"Constrained strings are not allowed."> : RequireLiteral<GenericString>;

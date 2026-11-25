import { Left } from '../left';
import { Right } from '../right';
import type * as DCommon from '../../common';
import type * as DTuple from '../../tuple';
export type RequireInformationCombination<GenericCombination extends DCommon.AnyTuple<Right | Left>> = DTuple.HasSpread<GenericCombination> extends true ? DCommon.ComputedTypeError<"Information combinations must be finite tuples."> : DCommon.ForbiddenUnion<GenericCombination>;

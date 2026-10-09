import { GetPropsWithValueExtends } from './getPropsWithValueExtends';
import type * as DCommon from '../../common';
export type ForbiddenUndefinedProps<GenericObject extends object> = DCommon.IsNever<GetPropsWithValueExtends<GenericObject, undefined>> extends true ? unknown : DCommon.ComputedTypeError<"Having \"undefined\" values for properties is not allowed.">;

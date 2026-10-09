import type * as DCommon from '../../common';
export interface Format<GenericName extends string, GenericFormat extends string = string> extends DCommon.Constraint<"string-format", Record<GenericName, GenericFormat>> {
}

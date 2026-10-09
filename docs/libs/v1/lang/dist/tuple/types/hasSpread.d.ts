import type * as DCommon from '../../common';
export type HasSpread<GenericTuple extends DCommon.AnyTuple> = DCommon.IsEqual<GenericTuple["length"], number>;

import { FundamentalType } from '../base';
import * as DChrono from '../../../chrono';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
export declare const timeFundamentalTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/time-fundamental-type", unknown>>;
export interface TheTime extends DCommon.Forward<FundamentalType<DChrono.TheTime> & DKind.Kind<typeof timeFundamentalTypeKind>> {
}
export declare const TheTime: TheTime;

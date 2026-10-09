import { FundamentalType } from '../base';
import * as DChrono from '../../../chrono';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
export declare const dateFundamentalTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/date-fundamental-type", unknown>>;
export interface TheDate extends DCommon.Forward<FundamentalType<DChrono.TheDate> & DKind.Kind<typeof dateFundamentalTypeKind>> {
}
export declare const TheDate: TheDate;

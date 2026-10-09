import { SuccessSymbol, ErrorSymbol } from '../common';
import type * as DCommon from '../../common';
import type * as DKind from '../../kind';
export declare const fundamentalTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/fundamental-type", unknown>>;
export interface FundamentalType<IncludedType extends unknown = unknown> extends DKind.Kind<typeof fundamentalTypeKind, IncludedType> {
    executeCheck(data: unknown): DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>;
}
export declare function createFundamentalType<GenericFundamentalType extends FundamentalType>(kindHandler: Exclude<DKind.GetHandler<GenericFundamentalType>, typeof fundamentalTypeKind>, executeCheck: (self: GenericFundamentalType, data: unknown) => DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>): GenericFundamentalType;

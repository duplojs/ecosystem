import { FundamentalType, fundamentalTypeKind } from '../base';
import type * as DKind from '../../../kind';
export type FundamentalTypeValue<GenericFundamentalType extends FundamentalType> = DKind.GetValue<typeof fundamentalTypeKind, GenericFundamentalType>;

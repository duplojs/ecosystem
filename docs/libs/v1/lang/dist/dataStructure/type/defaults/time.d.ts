import { TypeDefinition, Type } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import type * as DChrono from '../../../chrono';
import * as FundamentalType from "../../fundamentalType";
export declare const timeTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/time-type", unknown>>;
export interface TimeTypeDefinition extends TypeDefinition {
}
export interface TimeType extends DCommon.Forward<Type<FundamentalType.TheTime, DChrono.TheTime, TimeTypeDefinition> & DKind.Kind<typeof timeTypeKind>> {
}
export declare const TimeType: () => TimeType;

import { TypeDefinition, Type } from '../base';
import type * as DCommon from '../../../common';
import type * as DKind from '../../../kind';
import type * as DChrono from '../../../chrono';
import * as FundamentalType from "../../fundamentalType";
export declare const dateTypeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/date-type", unknown>>;
export interface DateTypeDefinition extends TypeDefinition {
}
export interface DateType extends DCommon.Forward<Type<FundamentalType.TheDate, DChrono.TheDate, DateTypeDefinition> & DKind.Kind<typeof dateTypeKind>> {
}
export declare const DateType: () => DateType;

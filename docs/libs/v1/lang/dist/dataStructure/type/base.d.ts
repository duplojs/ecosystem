import { FundamentalType, FundamentalTypeValue } from '../fundamentalType';
import { ErrorSymbol, SuccessSymbol } from '../common';
import type * as DKind from '../../kind';
import * as DCommon from '../../common';
export declare const typeKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/type", unknown>>;
export interface TypeDefinition {
    readonly message?: string;
}
export interface Type<GenericFundamentalType extends FundamentalType = FundamentalType, GenericValue extends FundamentalTypeValue<GenericFundamentalType> = FundamentalTypeValue<GenericFundamentalType>, GenericDefinition extends TypeDefinition = TypeDefinition> extends DKind.Kind<typeof typeKind, GenericValue> {
    readonly fundamentalType: GenericFundamentalType;
    readonly definition: GenericDefinition;
    executeCheck(data: unknown): DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>;
    isAsynchronous(): boolean;
    clone(): this;
    setMessage(massage: string): this;
    addMessage(massage: string): this;
}
export interface CreateTypeInitParams<GenericType extends Type = Type, GenericFundamentalType extends FundamentalType = FundamentalType> {
    executeCheck(self: GenericType, data: FundamentalTypeValue<GenericFundamentalType>): DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>;
    isAsynchronous(self: GenericType): boolean;
}
export interface CreateTypeConstructorParams<GenericFundamentalType extends FundamentalType = FundamentalType, GenericKindHandler extends DKind.Handler = DKind.Handler> {
    init<GenericType extends (Type<GenericFundamentalType> & DKind.Kind<GenericKindHandler>)>(definition: GenericType["definition"], params: CreateTypeInitParams<GenericType, GenericFundamentalType>): GenericType;
}
export declare function createType<GenericFundamentalType extends FundamentalType, GenericKindHandler extends DKind.Handler, GenericConstructor extends ((...args: any[]) => (Type<GenericFundamentalType> & DKind.Kind<GenericKindHandler>))>(fundamentalType: GenericFundamentalType, kindHandler: GenericKindHandler, createConstructor: (params: CreateTypeConstructorParams<GenericFundamentalType, GenericKindHandler>) => GenericConstructor): GenericConstructor;

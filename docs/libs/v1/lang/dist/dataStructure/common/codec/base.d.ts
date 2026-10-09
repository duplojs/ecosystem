import { FundamentalTypeValue, FundamentalType } from '../../fundamentalType';
import { GetErrorHandler } from '../error';
import { ErrorSymbol } from '../resultSymbol';
import type * as DKind from '../../../kind';
import * as DCommon from '../../../common';
import type * as DObject from '../../../object';
export declare const codecKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/codec", unknown>>;
export interface Codec<GenericFundamentalType extends FundamentalType = FundamentalType, GenericEncodedValue extends unknown = unknown> extends DKind.Kind<typeof codecKind> {
    readonly fundamentalType: GenericFundamentalType;
    predicateEncode(input: unknown): input is GenericEncodedValue;
    encode(data: FundamentalTypeValue<GenericFundamentalType>, errorHandler?: GetErrorHandler): DCommon.MaybePromise<GenericEncodedValue | ErrorSymbol>;
    decode(data: GenericEncodedValue, errorHandler?: GetErrorHandler): DCommon.MaybePromise<FundamentalTypeValue<GenericFundamentalType> | ErrorSymbol>;
}
export type CodecContext = Map<FundamentalType, Codec>;
export declare const codecsKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/codecs", unknown>>;
export interface Codecs<GenericCodecMapper extends Record<string, Codec> = Record<string, Codec>> extends DKind.Kind<typeof codecsKind> {
    readonly definition: GenericCodecMapper;
    readonly context: DCommon.Memoized<CodecContext>;
}
export declare function createCodec<GenericFundamentalType extends FundamentalType = FundamentalType, GenericEncodedValue extends unknown = unknown>(fundamentalType: GenericFundamentalType, predicateEncode: (data: unknown) => data is GenericEncodedValue, encode: (data: FundamentalTypeValue<GenericFundamentalType>, self: Codec<GenericFundamentalType, GenericEncodedValue>, errorHandler?: GetErrorHandler) => DCommon.MaybePromise<GenericEncodedValue | ErrorSymbol>, decode: (data: GenericEncodedValue, self: Codec<GenericFundamentalType, GenericEncodedValue>, errorHandler?: GetErrorHandler) => DCommon.MaybePromise<FundamentalTypeValue<GenericFundamentalType> | ErrorSymbol>): Codec<GenericFundamentalType, GenericEncodedValue>;
type ForbiddenDuplicateFundamentalType<GenericDefinition extends Record<string, Codec>> = {
    [Prop in keyof GenericDefinition]: [GenericDefinition[Prop]];
}[keyof GenericDefinition] extends infer InferredResult extends [unknown] ? DCommon.IsEqual<DCommon.RemoveDuplicateInUnion<InferredResult>, InferredResult> extends true ? unknown : DCommon.ComputedTypeError<"Several codecs use the same fundamental type."> : never;
export declare function createCodecs<GenericDefinition extends Record<string, Codec>>(definition: (GenericDefinition & ForbiddenDuplicateFundamentalType<GenericDefinition>)): Codecs<GenericDefinition>;
export interface EncodeStructure<GenericValue extends unknown, GenericCodecs extends Codecs> {
}
type TreatValue<GenericEncodedStructure extends unknown, GenericValue extends unknown, GenericCodec extends Codec> = DCommon.IsNever<GenericEncodedStructure> extends true ? DCommon.NeverCoalescing<GenericCodec extends Codec<infer InferredFundamentalType, infer InferredEncodedValue> ? GenericValue extends FundamentalTypeValue<InferredFundamentalType> ? InferredEncodedValue : never : never, GenericValue> : GenericEncodedStructure;
export type EncodedValue<GenericValue extends unknown, GenericCodecs extends Codecs> = GenericValue extends unknown ? TreatValue<DObject.Values<EncodeStructure<GenericValue, GenericCodecs>>, GenericValue, DObject.Values<GenericCodecs["definition"]>> : never;
export {};

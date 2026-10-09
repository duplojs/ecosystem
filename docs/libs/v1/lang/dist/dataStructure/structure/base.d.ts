import { ErrorPromise, ErrorSymbol, GetErrorHandler, SuccessSymbol, EncodedValue, CodecContext, Error, Codecs } from '../common';
import { Constraint } from '../constraint';
import { ComputeStructureValue } from './types';
import type * as DKind from '../../kind';
import * as DEither from '../../either';
import * as DCommon from '../../common';
export declare class StructureClass {
    private constructor();
    static init(params: DKind.Remove<Structure>): Structure;
    static addToPrototype<GenericProp extends keyof Structure>(prop: GenericProp, value: Structure[GenericProp] extends infer InferredValue ? InferredValue extends DCommon.AnyFunction ? (self: Structure, ...rest: Parameters<InferredValue>) => ReturnType<InferredValue> : Structure[GenericProp] : never): void;
}
export declare const structureKind: DKind.Handler<DKind.Definition<"@DuplojsLangDataStructure/structure", unknown>>;
export interface StructureDefinition<GenericConstraints extends readonly Constraint<any>[] = readonly Constraint<any>[]> {
    readonly message?: string;
    readonly constraints: readonly [...GenericConstraints];
}
export interface Structure<out GenericValue extends unknown = unknown, out GenericDefinition extends StructureDefinition<readonly Constraint<unknown, GenericValue>[]> = StructureDefinition<readonly Constraint<unknown, GenericValue>[]>> extends DKind.Kind<typeof structureKind, ComputeStructureValue<GenericValue, GenericDefinition["constraints"]>> {
    readonly definition: GenericDefinition;
    addConstraint<const GenericNewConstraints extends DCommon.AnyTuple<Constraint<GenericValue>>>(...args: DCommon.FixDeepFunctionInfer<DCommon.AnyTuple<Constraint<GenericValue>>, GenericNewConstraints>): Structure<ComputeStructureValue<GenericValue, GenericDefinition["constraints"]>, StructureDefinition<readonly [...this["definition"]["constraints"], ...GenericNewConstraints]>>;
    executeConstraints(data: unknown, errorHandler?: GetErrorHandler): DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>;
    executeCheck(data: unknown, errorHandler?: GetErrorHandler): DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>;
    executeEncode(codecContext: CodecContext, data: unknown, errorHandler?: GetErrorHandler): unknown;
    executeDecode(codecContext: CodecContext, data: unknown, errorHandler?: GetErrorHandler): unknown;
    executeParse(codecContext: CodecContext, data: unknown, errorHandler?: GetErrorHandler): unknown;
    isAsynchronous(): boolean;
    check(data: unknown): (DEither.Right<"check-success", ComputeStructureValue<GenericValue, GenericDefinition["constraints"]>> | DEither.Left<"async-error", ErrorPromise> | DEither.Left<"check-error", Error>);
    asyncCheck(data: unknown): Promise<DEither.Right<"check-success", ComputeStructureValue<GenericValue, GenericDefinition["constraints"]>> | DEither.Left<"check-error", Error>>;
    is(data: unknown): data is ComputeStructureValue<GenericValue, GenericDefinition["constraints"]>;
    encode<GenericCodecs extends Codecs>(codecs: GenericCodecs, data: unknown): (DEither.Right<"encode-success", EncodedValue<ComputeStructureValue<GenericValue, GenericDefinition["constraints"]>, GenericCodecs>> | DEither.Left<"async-error", ErrorPromise> | DEither.Left<"encode-error", Error>);
    asyncEncode<GenericCodecs extends Codecs>(codecs: GenericCodecs, data: unknown): Promise<DEither.Right<"encode-success", EncodedValue<ComputeStructureValue<GenericValue, GenericDefinition["constraints"]>, GenericCodecs>> | DEither.Left<"encode-error", Error>>;
    decode<GenericCodecs extends Codecs>(codecs: GenericCodecs, data: unknown): (DEither.Right<"decode-success", ComputeStructureValue<GenericValue, GenericDefinition["constraints"]>> | DEither.Left<"async-error", ErrorPromise> | DEither.Left<"decode-error", Error>);
    asyncDecode<GenericCodecs extends Codecs>(codecs: GenericCodecs, data: unknown): Promise<DEither.Right<"decode-success", ComputeStructureValue<GenericValue, GenericDefinition["constraints"]>> | DEither.Left<"decode-error", Error>>;
    parse(data: unknown, codecs?: Codecs): (DEither.Right<"parse-success", ComputeStructureValue<GenericValue, GenericDefinition["constraints"]>> | DEither.Left<"async-error", ErrorPromise> | DEither.Left<"parse-error", Error>);
    asyncParse(data: unknown, codecs?: Codecs): Promise<DEither.Right<"parse-success", ComputeStructureValue<GenericValue, GenericDefinition["constraints"]>> | DEither.Left<"parse-error", Error>>;
    contract<GenericContractValue extends unknown, GenericArgs extends (DCommon.IsEqual<ComputeStructureValue<GenericValue, GenericDefinition["constraints"]>, GenericContractValue> extends true ? [] : [] & DCommon.ComputedTypeError<"Contract error.">) = (DCommon.IsEqual<ComputeStructureValue<GenericValue, GenericDefinition["constraints"]>, GenericContractValue> extends true ? [] : [] & DCommon.ComputedTypeError<"Contract error.">)>(...args: NoInfer<GenericArgs>): Structure<GenericContractValue>;
    clone(): this;
    setMessage(massage: string): this;
    addMessage(massage: string): this;
}
export interface CreateStructureInitParams<GenericStructure extends Structure = Structure> {
    executeCheck(self: GenericStructure, data: unknown, errorHandler?: GetErrorHandler): DCommon.MaybePromise<SuccessSymbol | ErrorSymbol>;
    executeEncode(self: GenericStructure, codecContext: CodecContext, data: unknown, errorHandler?: GetErrorHandler): unknown;
    executeDecode(self: GenericStructure, codecContext: CodecContext, data: unknown, errorHandler?: GetErrorHandler): unknown;
    executeParse(self: GenericStructure, codecContext: CodecContext, data: unknown, errorHandler?: GetErrorHandler): unknown;
    isAsynchronous(self: GenericStructure): boolean;
}
export type CreateStructureInitRest<GenericStructure extends Structure = Structure> = {
    [Prop in Exclude<keyof GenericStructure, keyof Structure>]: GenericStructure[Prop] extends DCommon.AnyFunction ? (self: GenericStructure, ...args: Parameters<GenericStructure[Prop]>) => ReturnType<GenericStructure[Prop]> : GenericStructure[Prop];
};
export interface CreateStructureConstructorParams<GenericKindHandler extends DKind.Handler = DKind.Handler> {
    init<GenericStructure extends (Structure & DKind.Kind<GenericKindHandler>)>(definition: GenericStructure["definition"], params: CreateStructureInitParams<GenericStructure>, ...args: DCommon.IsNever<Exclude<keyof GenericStructure, keyof Structure>> extends true ? [] : [rest: CreateStructureInitRest<GenericStructure>]): NoInfer<GenericStructure>;
}
export declare function createStructure<GenericKindHandler extends DKind.Handler, GenericConstructor extends ((...args: any[]) => (Structure & DKind.Kind<GenericKindHandler>))>(kindHandler: GenericKindHandler, createConstructor: (params: CreateStructureConstructorParams<GenericKindHandler>) => GenericConstructor): GenericConstructor;

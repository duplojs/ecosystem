import { Error, SymbolCommandError } from '../error';
import * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
export declare const optionKind: DKind.Handler<DKind.Definition<"@DuplojsServerCommand/command-option", unknown>>;
export interface Option<GenericName extends string = string, GenericValue extends unknown = unknown> extends DKind.Kind<typeof optionKind> {
    readonly name: GenericName;
    readonly description: string | null;
    readonly aliases: readonly string[];
    execute(args: readonly string[], error: Error): Promise<{
        result: GenericValue;
        argumentRest: readonly string[];
    } | SymbolCommandError>;
}
export interface CreateOptionInitParams {
    description: string | null;
    aliases: readonly string[];
}
export type CreateOptionInitRest<GenericOption extends Option = Option> = {
    [Prop in Exclude<keyof GenericOption, keyof Option>]: GenericOption[Prop] extends DCommon.AnyFunction ? (self: GenericOption, ...args: Parameters<GenericOption[Prop]>) => ReturnType<GenericOption[Prop]> : GenericOption[Prop];
};
export interface CreateOptionConstructorParams<GenericKindHandler extends DKind.Handler = DKind.Handler> {
    init<GenericOption extends (Option & DKind.Kind<GenericKindHandler>)>(name: GenericOption["name"], execute: (self: GenericOption, value: string | undefined | null, error: Error) => DCommon.MaybePromise<Extract<Awaited<ReturnType<GenericOption["execute"]>>, object>["result"] | SymbolCommandError>, params: CreateOptionInitParams, ...args: DCommon.IsNever<Exclude<keyof GenericOption, keyof Option>> extends true ? [] : [rest: CreateOptionInitRest<GenericOption>]): NoInfer<GenericOption>;
}
export declare function constructOption<GenericKindHandler extends DKind.Handler, GenericConstructor extends ((...args: any[]) => (Option & DKind.Kind<GenericKindHandler>))>(kindHandler: GenericKindHandler, createConstructor: (params: CreateOptionConstructorParams<GenericKindHandler>) => GenericConstructor): GenericConstructor;

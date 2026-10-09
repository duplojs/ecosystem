import { Option } from './options';
import { SymbolCommandError, Error } from './error';
import { Argument } from './argument';
import { ForbiddenDuplicateName } from './types';
import * as DCommon from "@duplojs-v1/lang/common";
import type * as DKind from "@duplojs-v1/lang/kind";
declare const commandKind: DKind.Handler<DKind.Definition<"@DuplojsServerCommand/command", unknown>>;
export declare function isCommands(input: unknown): input is DCommon.AnyTuple<Command>;
type CommandSubject = {
    readonly type: "subCommand";
    readonly subCommands: readonly Command[];
} | {
    readonly type: "argument";
    readonly args: readonly Argument[];
};
export interface Command<GenericName extends string = string> extends DKind.Kind<typeof commandKind> {
    readonly name: GenericName;
    readonly description: string | null;
    readonly subject: CommandSubject | null;
    readonly options: readonly Option[];
    execute(args: readonly string[], error: Error): Promise<undefined | SymbolCommandError>;
}
export type Subjects = (DCommon.AnyTuple<Argument> | DCommon.AnyTuple<Command>);
export type ForbiddenBadOrderArguments<GenericSubject extends readonly Subjects[number][], GenericContainOptional extends boolean = false> = GenericSubject extends readonly [
    Argument<string, infer InferredValue>,
    ...infer InferredRest extends Argument[]
] ? DCommon.And<[
    DCommon.IsEqual<GenericContainOptional, true>,
    DCommon.Not<DCommon.UnionContain<InferredValue, undefined>>
]> extends true ? DCommon.ComputedTypeError<"Optional argument can't be define before required argument"> : ForbiddenBadOrderArguments<InferredRest, DCommon.UnionContain<InferredValue, undefined>> : unknown;
export interface CreateCommandParams<GenericOptions extends DCommon.AnyTuple<Option> = DCommon.AnyTuple<Option>, GenericSubject extends Subjects = Subjects> {
    readonly description?: string;
    readonly options?: (GenericOptions & ForbiddenDuplicateName<GenericOptions, "option">);
    readonly subjects?: (GenericSubject & ForbiddenDuplicateName<GenericSubject, "subject"> & ForbiddenBadOrderArguments<GenericSubject>);
}
export type CreateCommandExecuteParams<GenericOptions extends DCommon.AnyTuple<Option>, GenericArguments extends DCommon.AnyTuple<Argument>> = ((DCommon.IsEqual<GenericOptions, never> extends true ? {} : {
    options: {
        readonly [GenericOption in GenericOptions[number] as GenericOption["name"]]: Exclude<Awaited<ReturnType<GenericOption["execute"]>>, SymbolCommandError>["result"];
    };
}) & (DCommon.IsEqual<GenericArguments, never> extends true ? {} : {
    args: {
        readonly [GenericArgument in GenericArguments[number] as GenericArgument["name"]]: Exclude<Awaited<ReturnType<GenericArgument["execute"]>>, SymbolCommandError>;
    };
}));
export declare function create<GenericName extends string>(name: GenericName, execute: () => void): Command<GenericName>;
export declare function create<GenericName extends string, const GenericOptions extends DCommon.AnyTuple<Option> = never, GenericSubjects extends Subjects = never>(name: GenericName, params: CreateCommandParams<GenericOptions, GenericSubjects>, execute: (params: CreateCommandExecuteParams<GenericOptions, Extract<GenericSubjects, DCommon.AnyTuple<Argument>>>) => DCommon.MaybePromise<void>): Command<GenericName>;
export {};

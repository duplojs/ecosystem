import { CreateCommandExecuteParams, CreateCommandParams, Subjects } from './create';
import { Error } from './error';
import { Option } from './options';
import { Argument } from './argument';
import { ForbiddenInvalidIdentifier } from './types';
import type * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DDataStructure from "@duplojs/lang/dataStructure";
export interface ExecCommandParams<GenericOptions extends DCommon.AnyTuple<Option> = DCommon.AnyTuple<Option>, GenericSubjects extends Subjects = Subjects, GenericDisplayName extends string = string> extends CreateCommandParams<GenericOptions, GenericSubjects> {
    displayName?: GenericDisplayName & ForbiddenInvalidIdentifier<GenericDisplayName>;
    dataStructureErrorInterpreter?: DDataStructure.ErrorInterpreter;
}
export declare function exec(execute: () => void): Promise<DEither.Ok | DEither.Left<"command-exec-error", Error>>;
export declare function exec<const GenericOptions extends DCommon.AnyTuple<Option> = never, GenericSubjects extends Subjects = never, const GenericDisplayName extends string = string>(params: ExecCommandParams<GenericOptions, GenericSubjects, GenericDisplayName>, execute: (params: CreateCommandExecuteParams<GenericOptions, Extract<GenericSubjects, DCommon.AnyTuple<Argument>>>) => DCommon.MaybePromise<void>): Promise<DEither.Ok | DEither.Left<"command-exec-error", Error>>;

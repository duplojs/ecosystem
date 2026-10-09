import { CreateCommandExecuteParams, CreateCommandParams, Subjects } from './create';
import { Error } from './error';
import { Option } from './options';
import { Argument } from './argument';
import type * as DCommon from "@duplojs-v1/lang/common";
import * as DEither from "@duplojs-v1/lang/either";
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export interface ExecCommandParams<GenericOptions extends DCommon.AnyTuple<Option> = DCommon.AnyTuple<Option>, GenericSubjects extends Subjects = Subjects> extends CreateCommandParams<GenericOptions, GenericSubjects> {
    displayName?: string;
    dataStructureErrorInterpreter?: DDataStructure.ErrorInterpreter;
}
export declare function exec(execute: () => void): Promise<DEither.Ok | DEither.Error<Error>>;
export declare function exec<const GenericOptions extends DCommon.AnyTuple<Option> = never, GenericSubjects extends Subjects = never>(params: ExecCommandParams<GenericOptions, GenericSubjects>, execute: (params: CreateCommandExecuteParams<GenericOptions, Extract<GenericSubjects, DCommon.AnyTuple<Argument>>>) => DCommon.MaybePromise<void>): Promise<DEither.Ok | DEither.Error<Error>>;

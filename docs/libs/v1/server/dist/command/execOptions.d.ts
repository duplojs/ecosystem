import { Error } from './error';
import { Option } from './options';
import { ForbiddenDuplicateName } from './types';
import type * as DCommon from "@duplojs-v1/lang/common";
import * as DEither from "@duplojs-v1/lang/either";
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
type ComputeResult<GenericOptions extends DCommon.AnyTuple<Option>> = DCommon.SimplifyTopLevel<{
    readonly [GenericOption in GenericOptions[number] as GenericOption extends Option<infer GenericName, unknown> ? GenericName : never]: GenericOption extends Option<string, infer GenericResult> ? GenericResult : never;
}>;
export interface ExecOptionsParams {
    dataStructureErrorInterpreter?: DDataStructure.ErrorInterpreter;
}
export declare function execOptions<GenericOptions extends DCommon.AnyTuple<Option>>(options: GenericOptions & ForbiddenDuplicateName<GenericOptions, "option">, params?: ExecOptionsParams): Promise<DEither.Success<Extract<ComputeResult<GenericOptions>, any>> | DEither.Right<"log-help"> | DEither.Error<Error>>;
export {};

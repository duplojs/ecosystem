import { EnvironmentVariableFileParams } from './environmentVariable';
import * as DEither from "@duplojs-v1/lang/either";
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DKind from "@duplojs-v1/lang/kind";
import type * as DSFile from '../file';
declare const EnvironmentVariableError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsServer/environment-variable-error", unknown>>, ErrorConstructor>;
export declare class EnvironmentVariableError extends EnvironmentVariableError_base {
    error: (Exclude<DSFile.ReadTextFileResult, DEither.Right> | DEither.Left<"decode-error", DDataStructure.Error>);
    constructor(error: (Exclude<DSFile.ReadTextFileResult, DEither.Right> | DEither.Left<"decode-error", DDataStructure.Error>));
}
export declare function environmentVariableOrThrow<GenericShape extends DDataStructure.ShapeObjectStructure>(shape: GenericShape, envFileParams?: EnvironmentVariableFileParams): Promise<DDataStructure.ShapeObjectStructureValue<GenericShape>>;
export {};

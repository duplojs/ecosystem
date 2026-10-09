import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DEither from "@duplojs-v1/lang/either";
import type * as DPath from "@duplojs-v1/lang/path";
import type * as DSFile from '../../file';
export interface EnvironmentVariableFileParams {
    includedEnvironmentFiles?: (string & DPath.Path)[];
    override?: boolean;
    justRead?: boolean;
    codecs?: DDataStructure.Codecs;
}
declare module '../../implementor' {
    interface ServerFunction {
        environmentVariable<GenericShape extends DDataStructure.ShapeObjectStructure>(shape: GenericShape, envFileParams?: EnvironmentVariableFileParams): Promise<DEither.Right<"decode-success", DDataStructure.ShapeObjectStructureValue<GenericShape>> | Exclude<DSFile.ReadTextFileResult, DEither.Right> | DEither.Left<"decode-error", DDataStructure.Error>>;
    }
}
export declare const environmentVariable: <GenericShape extends DDataStructure.ShapeObjectStructure>(shape: GenericShape, envFileParams?: EnvironmentVariableFileParams) => Promise<DEither.Right<"decode-success", DDataStructure.ShapeObjectStructureValue<GenericShape>> | Exclude<DSFile.ReadTextFileResult, DEither.Right> | DEither.Left<"decode-error", DDataStructure.Error>>;

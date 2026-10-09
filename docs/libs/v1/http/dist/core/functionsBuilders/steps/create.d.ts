import { BuildedStep, Steps } from '../../steps/types';
import { HookRouteLifeCycle } from '../../route';
import { ResponseContract } from '../../response';
import { Environment } from '../../types';
import { ExtractShapeCodecs } from '../../steps';
import type * as DCommon from "@duplojs-v1/lang/common";
import * as DEither from "@duplojs-v1/lang/either";
export interface BuildStepResult {
    readonly buildedFunction: BuildedStep;
    readonly hooksRouteLifeCycle: readonly HookRouteLifeCycle[];
}
export type BuildStepSuccessEither = DEither.Right<"buildSuccess", BuildStepResult>;
export type BuildStepNotSupportEither = DEither.Left<"stepNotSupport", Steps>;
export interface StepFunctionBuilderParams {
    buildStep(element: Steps): Promise<BuildStepSuccessEither | BuildStepNotSupportEither>;
    success(result: BuildStepResult): BuildStepSuccessEither;
    readonly environment: Environment;
    readonly defaultExtractContract: ResponseContract.Contract;
    readonly defaultCodecs: ExtractShapeCodecs;
}
export declare function createStepFunctionBuilder<GenericSupportStep extends Steps>(support: (step: Steps) => step is GenericSupportStep, builder: (step: GenericSupportStep, params: StepFunctionBuilderParams) => DCommon.MaybePromise<BuildStepSuccessEither | BuildStepNotSupportEither>): (step: Steps, params: StepFunctionBuilderParams) => DCommon.MaybePromise<BuildStepSuccessEither | BuildStepNotSupportEither>;

import { Steps } from '../../../steps';
import { BuildStepResult, StepFunctionBuilderParams } from '../create';
import * as DCommon from "@duplojs-v1/lang/common";
export declare function buildStepsFunction(steps: readonly Steps[], buildStep: StepFunctionBuilderParams["buildStep"]): Promise<import('..').BuildStepNotSupportEither | readonly BuildStepResult[]>;
export declare const defaultProcessStepFunctionBuilder: (step: Steps, params: StepFunctionBuilderParams) => DCommon.MaybePromise<import('..').BuildStepSuccessEither | import('..').BuildStepNotSupportEither>;

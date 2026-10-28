import { Steps } from '../../steps/types';
import { BuildStepNotSupportEither, createStepFunctionBuilder } from './create';
import { Environment, ExtractOtherwise } from '../../types';
import { ExtractShapeCodecs } from '../../steps';
export interface BuildStepFunctionParams {
    readonly stepFunctionBuilders: readonly ReturnType<typeof createStepFunctionBuilder>[];
    readonly environment: Environment;
    readonly defaultExtractOtherwise: ExtractOtherwise;
    readonly defaultCodecs: ExtractShapeCodecs;
}
export declare function buildStepFunction(step: Steps, params: BuildStepFunctionParams): Promise<import('./create').BuildStepSuccessEither | BuildStepNotSupportEither>;

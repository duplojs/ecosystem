import { Steps } from '../../core/steps';
import { ResponseContract } from '../../core/response';
import { EntrypointKey } from './types';
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export type EntrypointReduceResult = Record<EntrypointKey, DDataStructure.Structure | Record<string, DDataStructure.Structure>>;
export interface AggregateStepsResult {
    entrypointContract: EntrypointReduceResult;
    endpointContract: readonly ResponseContract.Contracts[];
}
export interface AggregateStepsParams {
    readonly defaultExtractContract: ResponseContract.Contract;
}
export declare function aggregateStepContract(steps: readonly Steps[], params: AggregateStepsParams): AggregateStepsResult;

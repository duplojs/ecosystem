import { Steps } from '../../core/steps';
import { EntrypointKey, OpenApiEndpointContract } from './types';
import { OpenApiEndpointContractMetadata } from './metadata';
import { Metadata } from '../../core/metadata';
import * as DDataStructure from "@duplojs/lang/dataStructure";
export type EntrypointReduceResult = Record<EntrypointKey, DDataStructure.Structure | Record<string, DDataStructure.Structure>>;
export interface AggregateStepsResult {
    entrypointContract: EntrypointReduceResult;
    endpointContract: readonly OpenApiEndpointContract[];
}
export interface AggregateStepsParams {
    readonly metadata?: readonly Metadata[];
    readonly defaultExtractMetadata?: ReturnType<typeof OpenApiEndpointContractMetadata>;
}
export declare function aggregateStepContract(steps: readonly Steps[], params?: AggregateStepsParams): AggregateStepsResult;

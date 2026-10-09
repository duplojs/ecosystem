import { Steps } from '../../core/steps';
import { EntrypointKey } from './types';
import { ResponseContract } from '../../core/response';
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
type EntrypointReduceResult = Record<EntrypointKey, DDataStructure.Structure | Record<string, DDataStructure.Structure>>;
export interface StepsToStructureParams {
    readonly defaultExtractContract: ResponseContract.Contract;
}
export interface StepsToStructureResult {
    entrypointContract: EntrypointReduceResult;
    endpointContract: readonly DDataStructure.Structure[];
}
export declare const defaultFluxStreamSchema: NoInfer<DDataStructure.TypeStructure<undefined, readonly []>>;
export declare function aggregateStepContract(steps: readonly Steps[], params: StepsToStructureParams): StepsToStructureResult;
export {};

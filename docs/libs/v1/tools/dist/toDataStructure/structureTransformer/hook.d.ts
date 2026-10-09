import { MapContext } from './create';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import type * as DStoTS from '../../toTypescript';
export type TransformerHookAction = "stop" | "next";
export interface TransformerHookOutput {
    readonly structure: DDataStructure.Structure;
    readonly action: TransformerHookAction;
}
export interface TransformerHookParams {
    readonly structure: DDataStructure.Structure;
    readonly context: MapContext;
    readonly importContext: DStoTS.MapImportContext;
    output(action: TransformerHookAction, structure: DDataStructure.Structure): TransformerHookOutput;
}
export type TransformerHook = (params: TransformerHookParams) => TransformerHookOutput;

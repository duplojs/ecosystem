import { MapContext } from './context';
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export type TransformerHookAction = "stop" | "next";
export interface TransformerHookOutput {
    readonly structure: DDataStructure.Structure;
    readonly action: TransformerHookAction;
}
export interface TransformerHookParams {
    readonly structure: DDataStructure.Structure;
    readonly context: MapContext;
    output(action: TransformerHookAction, structure: DDataStructure.Structure): TransformerHookOutput;
}
export type TransformerHook = (params: TransformerHookParams) => TransformerHookOutput;

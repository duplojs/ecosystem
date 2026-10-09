import { ProcessDefinition } from '../../process';
import { Floor } from '../../types';
import { HookRouteLifeCycle } from '../../route';
import { Metadata } from '../../metadata';
import * as DCommon from "@duplojs-v1/lang/common";
export interface ProcessBuilder<GenericDefinition extends ProcessDefinition = ProcessDefinition, GenericFloor extends Floor = {}> extends DCommon.Builder<ProcessDefinition> {
}
export declare const processBuilder: DCommon.BuilderHandler<ProcessBuilder<ProcessDefinition, {}>>;
export declare function useProcessBuilder<GenericOptions extends ProcessDefinition["options"] = never, const GenericHooks extends readonly HookRouteLifeCycle[] = readonly [], const GenericMetadata extends readonly Metadata[] = readonly []>(params?: {
    options?: GenericOptions;
    hooks?: GenericHooks | readonly HookRouteLifeCycle[];
    metadata?: GenericMetadata;
}): ProcessBuilder<{
    readonly steps: readonly [];
    readonly options: DCommon.NeverCoalescing<GenericOptions, undefined>;
    readonly hooks: GenericHooks;
    readonly metadata: GenericMetadata;
}, DCommon.IsEqual<GenericOptions, never> extends true ? {} : {
    options: GenericOptions;
}>;

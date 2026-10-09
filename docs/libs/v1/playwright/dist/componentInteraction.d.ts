import { Locator as PlaywrightLocator } from 'playwright/test';
import { Component, ComponentElements } from './component';
import * as DKind from "@duplojs-v1/lang/kind";
interface ContextStepEmbedded {
    component: Component<string, ComponentElements>;
    elementKey: string;
    element: PlaywrightLocator;
}
export type StepEmbeddedFunction = (context: ContextStepEmbedded, ...args: any) => any;
interface MissingComponentElementErrorParams {
    componentName: string;
    elementKey: string;
    availableElements: string[];
}
export type ElementsSelector<GenericElementKey extends string> = [
    element: GenericElementKey,
    target: number | "first" | "last"
];
declare const MissingComponentElementError_base: DKind.KindClass<DKind.Handler<DKind.Definition<"@DuplojsPlaywright/missing-component-element-error", unknown>>, ErrorConstructor>;
export declare class MissingComponentElementError extends MissingComponentElementError_base {
    params: MissingComponentElementErrorParams;
    constructor(params: MissingComponentElementErrorParams);
}
export declare function createComponentInteraction<GenericStepEmbeddedFunction extends StepEmbeddedFunction>(stepName: string, step: GenericStepEmbeddedFunction): <GenericComponent extends Component<string, Record<string, PlaywrightLocator>, any, any>, GenericElementKey extends (Extract<keyof GenericComponent["elements"], string> | ElementsSelector<Extract<keyof GenericComponent["elements"], string>>)>(component: GenericComponent, elementSelector: GenericElementKey, ...args: Parameters<GenericStepEmbeddedFunction> extends [any, ...infer InferredRest] ? InferredRest : never) => Promise<any>;
export type WrapperStepEmbeddedFunction = Record<string, ReturnType<typeof createComponentInteraction>>;
export declare function createStepWrapper<GenericWrapperStepEmbeddedFunction extends WrapperStepEmbeddedFunction>(wrapperStepEmbeddedFunction: GenericWrapperStepEmbeddedFunction): (stepName: string) => GenericWrapperStepEmbeddedFunction;
export {};

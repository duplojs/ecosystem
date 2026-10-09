import { Locator as PlaywrightLocator } from 'playwright/test';
import { Website } from './website';
import type * as DKind from "@duplojs-v1/lang/kind";
export type ComponentElements = Record<string, PlaywrightLocator>;
export type ComponentMethods = Record<string, (...args: any[]) => any>;
export interface ComponentEngine {
    (website: Website): Component<any, any, any, any>;
    componentName: string;
}
type FormatComponent<GenericComponent extends ComponentEngine> = {
    [Component in GenericComponent as Component["componentName"]]: Component;
};
declare const componentKind: DKind.Handler<DKind.Definition<"@DuplojsPlaywright/component", unknown>>;
export interface Component<GenericName extends string = string, GenericElements extends ComponentElements | undefined = ComponentElements | undefined, GenericMethods extends ComponentMethods | undefined = undefined, GenericComponent extends ComponentEngine = never> extends DKind.Kind<typeof componentKind, GenericName> {
    name: GenericName;
    get mainElement(): PlaywrightLocator;
    elements: GenericElements;
    methods: GenericMethods;
    iWantToSeeComponent<GenericComponentName extends GenericComponent["componentName"]>(componentName: GenericComponentName): Promise<ReturnType<Extract<GenericComponent, {
        componentName: GenericComponentName;
    }>>>;
    components: FormatComponent<GenericComponent>;
}
export interface GetComponentMainElementParams {
    body: PlaywrightLocator;
}
export interface GetComponentElementsParams {
    mainElement: PlaywrightLocator;
    body: PlaywrightLocator;
}
export interface GetComponentMethodsParams<GenericElements extends ComponentElements | undefined> {
    mainElement: PlaywrightLocator;
    body: PlaywrightLocator;
    elements: GenericElements;
    website: Website;
}
export declare function createComponent<GenericName extends string, GenericElements extends ComponentElements | undefined = undefined, GenericMethods extends ComponentMethods | undefined = undefined, GenericComponent extends ComponentEngine = never>(name: GenericName, params: {
    getMainElement(params: GetComponentMainElementParams): PlaywrightLocator;
    getElements?(params: GetComponentElementsParams): GenericElements;
    getMethods?(params: GetComponentMethodsParams<GenericElements>): GenericMethods;
    components?: GenericComponent[];
}): {
    (website: Website): Component<GenericName, GenericElements, GenericMethods, GenericComponent>;
    componentName: GenericName;
};
export {};

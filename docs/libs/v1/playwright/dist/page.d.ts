import { Locator as PlaywrightLocator } from 'playwright/test';
import { ComponentEngine, ComponentMethods, GetComponentMethodsParams, GetComponentElementsParams, GetComponentMainElementParams, ComponentElements, Component } from './component';
import { Website } from './website';
import type * as DKind from "@duplojs-v1/lang/kind";
declare const pageKind: DKind.Handler<DKind.Definition<"@DuplojsPlaywright/page", unknown>>;
export interface PageEngine<GenericName extends string = string, GenericPathParams extends Record<string, unknown> = Record<string, unknown>, GenericElements extends ComponentElements | undefined = undefined, GenericMethods extends ComponentMethods | undefined = undefined, GenericComponent extends ComponentEngine = never> {
    (website: Website): Page<GenericName, GenericPathParams, GenericElements, GenericMethods, GenericComponent>;
    componentName: GenericName;
}
type InferPagePathParams<GenericMakePath extends (...args: any[]) => string> = Parameters<GenericMakePath> extends [] ? Record<string, unknown> : Parameters<GenericMakePath>[0] extends Record<string, unknown> ? Parameters<GenericMakePath>[0] : never;
type _Page<GenericName extends string, GenericElement extends ComponentElements | undefined, GenericMethods extends ComponentMethods | undefined, GenericComponent extends ComponentEngine> = (Component<GenericName, GenericElement, GenericMethods, GenericComponent> & DKind.Kind<typeof pageKind, GenericName>);
export interface Page<GenericName extends string = string, GenericPathParams extends Record<string, unknown> = Record<string, unknown>, GenericElement extends ComponentElements | undefined = ComponentElements | undefined, GenericMethods extends ComponentMethods | undefined = undefined, GenericComponent extends ComponentEngine = never> extends _Page<GenericName, GenericElement, GenericMethods, GenericComponent> {
    makePath(...args: {} extends GenericPathParams ? [params?: GenericPathParams] : [params: GenericPathParams]): string;
}
export declare function createPage<GenericName extends string, GenericMakePath extends (...args: any[]) => string, GenericElements extends ComponentElements | undefined = undefined, GenericMethods extends ComponentMethods | undefined = undefined, GenericComponent extends ComponentEngine = never>(name: GenericName, params: {
    makePath: GenericMakePath;
    getMainElement(params: GetComponentMainElementParams): PlaywrightLocator;
    getElements?(params: GetComponentElementsParams): GenericElements;
    getMethods?(params: GetComponentMethodsParams<GenericElements>): GenericMethods;
    components?: GenericComponent[];
}): PageEngine<GenericName, InferPagePathParams<GenericMakePath>, GenericElements, GenericMethods, GenericComponent>;
export {};

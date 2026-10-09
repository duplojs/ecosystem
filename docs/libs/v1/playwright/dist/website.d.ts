import { BrowserContext as PlaywrightBrowserContext, Page as PlaywrightPage } from 'playwright/test';
import { createComponent } from './component';
import { PageEngine } from './page';
import type * as DKind from "@duplojs-v1/lang/kind";
import type * as DCommon from "@duplojs-v1/lang/common";
declare const webSiteKind: DKind.Handler<DKind.Definition<"@DuplojsPlaywright/web-site", unknown>>;
type PageOf<GenericPageEngine extends PageEngine<any, any, any, any, any>> = ReturnType<GenericPageEngine>;
type PageArgs<GenericPageEngine extends PageEngine<any, any, any, any, any>> = Parameters<PageOf<GenericPageEngine>["makePath"]>;
export interface Website extends DKind.Kind<typeof webSiteKind> {
    playwrightPage: PlaywrightPage;
    iNavigateTo<GenericPageEngine extends PageEngine<any, any, any, any, any>>(pageEngine: GenericPageEngine, ...args: PageArgs<GenericPageEngine>): Promise<PageOf<GenericPageEngine>>;
    iGoTo<GenericPageEngine extends PageEngine<any, any, any, any, any>>(pageEngine: GenericPageEngine, ...args: PageArgs<GenericPageEngine>): Promise<PageOf<GenericPageEngine>>;
    iWantToBeOnPage<GenericPageEngine extends PageEngine<any, any, any, any, any>>(pageEngine: GenericPageEngine): Promise<PageOf<GenericPageEngine>>;
    iWantToSee<GenericComponentEngine extends ReturnType<typeof createComponent>>(componentEngine: GenericComponentEngine): Promise<ReturnType<GenericComponentEngine>>;
    iWantToExist<GenericComponentEngine extends ReturnType<typeof createComponent>>(componentEngine: GenericComponentEngine): Promise<ReturnType<GenericComponentEngine>>;
    iExpectTitleIs(title: string | RegExp): Promise<void>;
    iExpectUrlIs(url: string | RegExp): Promise<void>;
    addCookies(...args: Parameters<PlaywrightBrowserContext["addCookies"]>): Promise<void>;
    refresh(): Promise<void>;
    setPrefix(prefix?: string): void;
    waitForHydration(): Promise<void>;
}
export interface WebsiteHooks {
    beforeNavigateOnPage?(): DCommon.MaybePromise<void>;
    afterNavigateOnPage?(): DCommon.MaybePromise<void>;
}
export interface EnvConfig {
    baseUrl?: string;
    prefix?: string;
}
export interface CreateWebsiteParams {
    playwrightPage: PlaywrightPage;
    playwrightBrowserContext: PlaywrightBrowserContext;
    envConfig: EnvConfig;
    hooks?: WebsiteHooks;
}
export declare function createWebsite(params: CreateWebsiteParams): Website;
export {};

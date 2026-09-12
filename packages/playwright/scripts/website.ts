import test, { type BrowserContext as PlaywrightBrowserContext, expect, type Page as PlaywrightPage } from "playwright/test";
import type { createComponent } from "./component";
import type { PageEngine } from "./page";
import type * as DKind from "@duplojs/lang/kind";
import type * as DCommon from "@duplojs/lang/common";
import { createKind } from "./kind";

const webSiteKind = createKind("web-site");

type PageOf<
	GenericPageEngine extends PageEngine<any, any, any, any, any>,
> = ReturnType<GenericPageEngine>;

type PageArgs<
	GenericPageEngine extends PageEngine<any, any, any, any, any>,
> = Parameters<PageOf<GenericPageEngine>["makePath"]>;

export interface Website extends DKind.Kind<typeof webSiteKind> {
	playwrightPage: PlaywrightPage;
	iNavigateTo<
		GenericPageEngine extends PageEngine<any, any, any, any, any>,
	>(
		pageEngine: GenericPageEngine,
		...args: PageArgs<GenericPageEngine>
	): Promise<PageOf<GenericPageEngine>>;
	iGoTo<
		GenericPageEngine extends PageEngine<any, any, any, any, any>,
	>(
		pageEngine: GenericPageEngine,
		...args: PageArgs<GenericPageEngine>
	): Promise<PageOf<GenericPageEngine>>;
	iWantToBeOnPage<
		GenericPageEngine extends PageEngine<any, any, any, any, any>,
	>(
		pageEngine: GenericPageEngine,
	): Promise<PageOf<GenericPageEngine>>;
	iWantToSee<
		GenericComponentEngine extends ReturnType<typeof createComponent>,
	>(
		componentEngine: GenericComponentEngine,
	): Promise<ReturnType<GenericComponentEngine>>;
	iWantToExist<
		GenericComponentEngine extends ReturnType<typeof createComponent>,
	>(
		componentEngine: GenericComponentEngine,
	): Promise<ReturnType<GenericComponentEngine>>;
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

export function createWebsite(params: CreateWebsiteParams) {
	let prefix = params.envConfig.prefix;

	function applyPrefix(path: string) {
		const normalizedPath = path.startsWith("/") ? path : `/${path}`;

		return prefix ? `/${prefix}${normalizedPath}` : normalizedPath;
	}

	function buildUrl(path: string) {
		const prefixedPath = applyPrefix(path);

		if (!params.envConfig.baseUrl) {
			return prefixedPath;
		}

		return new URL(prefixedPath, params.envConfig.baseUrl).toString();
	}

	async function hooksBeforeNavigateOnPage() {
		if (!params.hooks?.beforeNavigateOnPage) {
			return;
		}

		return test.step("website: launch before navigate on page hooks", params.hooks.beforeNavigateOnPage);
	}

	async function hooksAfterNavigateOnPage() {
		if (!params.hooks?.afterNavigateOnPage) {
			return;
		}

		return test.step("website: launch after navigate on page hooks", params.hooks.afterNavigateOnPage);
	}

	const website: Website = webSiteKind.setTo(
		{
			playwrightPage: params.playwrightPage,
			async iNavigateTo<
				GenericPageEngine extends PageEngine<any, any, any, any, any>,
			>(pageEngine: GenericPageEngine, ...args: PageArgs<GenericPageEngine>) {
				const page = pageEngine(website);
				const url = buildUrl(
					(page.makePath as (...args: PageArgs<GenericPageEngine>) => string)(...args),
				);

				await test.step(`website: I navigate to ${page.name}:${url}`, async() => {
					await hooksBeforeNavigateOnPage();
					await params.playwrightPage.goto(url);
					await expect(params.playwrightPage).toHaveURL(url);
					await expect(page.mainElement).toBeVisible();
				});

				await hooksAfterNavigateOnPage();

				return page as never;
			},
			async iGoTo<
				GenericPageEngine extends PageEngine<any, any, any, any, any>,
			>(pageEngine: GenericPageEngine, ...args: PageArgs<GenericPageEngine>) {
				const page = pageEngine(website);
				const url = buildUrl(
					(page.makePath as (...args: PageArgs<GenericPageEngine>) => string)(...args),
				);

				await test.step(`website: I go to ${page.name}:${url}`, async() => {
					await hooksBeforeNavigateOnPage();
					await params.playwrightPage.goto(url);
				});

				await hooksAfterNavigateOnPage();

				return page as never;
			},
			async iWantToBeOnPage<
				GenericPageEngine extends PageEngine<any, any, any, any, any>,
			>(pageEngine: GenericPageEngine) {
				const page = pageEngine(website);

				await test.step(`website: I want be on this page ${page.name}`, async() => {
					await expect(page.mainElement).toBeVisible();
				});

				return page as never;
			},
			async iWantToSee(componentEngine) {
				const component = componentEngine(website);

				await test.step(`website: I want to see ${component.name}`, async() => {
					await expect(component.mainElement).toBeVisible();
				});

				return component as never;
			},
			async iWantToExist(componentEngine) {
				const component = componentEngine(website);

				await test.step(`website: I want to exist ${component.name}`, async() => {
					await expect(component.mainElement).toBeAttached();
				});

				return component as never;
			},
			async iExpectTitleIs(title) {
				await test.step(`website: I want page title is ${title.toString()}`, async() => {
					await expect(params.playwrightPage).toHaveTitle(title);
				});
			},
			async iExpectUrlIs(url) {
				await test.step(`website: I want page url is ${url.toString()}`, async() => {
					await expect(params.playwrightPage).toHaveURL(url);
				});
			},
			addCookies(...args) {
				return params.playwrightBrowserContext.addCookies(...args);
			},
			async refresh() {
				await test.step("website: Reload page", async() => {
					await params.playwrightPage.reload();
				});

				await hooksAfterNavigateOnPage();
			},
			setPrefix(newPrefix) {
				prefix = newPrefix;
			},
			async waitForHydration() {
				await test.step("website: wait for hydration", async() => {
					await params.playwrightPage.waitForSelector("[aria-hydrated=\"true\"]", {
						state: "visible",
						timeout: 5000,
					});
				});
			},
		} satisfies DKind.Remove<Website>,
		undefined,
	);

	return website;
}

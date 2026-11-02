/**
 * @title createWebsite
 *
 * Construire le contexte du site et naviguer ou vérifier ses pages et composants.
 */
import { createComponent, createPage, createWebsite } from "@duplojs/playwright";
import type { BrowserContext, Page } from "playwright/test";

declare const playwrightPage: Page;
declare const playwrightBrowserContext: BrowserContext;

const website = createWebsite({
	playwrightPage,
	playwrightBrowserContext,
	envConfig: {
		baseUrl: "https://example.com",
		prefix: "admin",
	},
	hooks: {
		beforeNavigateOnPage: () => playwrightPage.waitForLoadState(),
		afterNavigateOnPage: () => playwrightPage.waitForLoadState(),
	},
});
const dashboard = createPage("dashboard", {
	makePath: () => "/dashboard",
	getMainElement: ({ body }) => body.locator("main"),
});
const notice = createComponent("notice", {
	getMainElement: ({ body }) => body.locator("[data-notice]"),
});

// URL https://example.com/admin/dashboard ; vérifie l’URL et la visibilité de la racine.
await website.iNavigateTo(dashboard);

// iGoTo navigue sans ces deux assertions ; les deux navigations exécutent les hooks.
await website.iGoTo(dashboard);
// racine visible, sans contrôle d’URL
await website.iWantToBeOnPage(dashboard);
// racine visible
await website.iWantToSee(notice);
// racine attachée au DOM
await website.iWantToExist(notice);
await website.iExpectTitleIs(/Dashboard/);
await website.iExpectUrlIs(/dashboard/);
await website.addCookies([
	{
		name: "session",
		value: "token",
		url: "https://example.com",
	},
]);
// retire le préfixe pour les prochaines navigations
website.setPrefix();
// recharge puis exécute le hook afterNavigateOnPage
await website.refresh();
// attend [aria-hydrated="true"] visible pendant 5 s au plus
await website.waitForHydration();

import { createComponent, type Website } from "@duplojs/playwright";

declare const website: Website;

const searchFormEngine = createComponent("search form", {
	getMainElement: ({ body }) => body.locator("form[data-search]"),
	getElements: ({ mainElement }) => ({
		query: mainElement.locator("input[name='query']"),
		submit: mainElement.locator("button[type='submit']"),
		onlyPublished: mainElement.locator("input[name='published']"),
		categories: mainElement.locator("select[name='categories'][multiple]"),
		feedback: mainElement.locator("[role='status']"),
	}),
});

const articleListEngine = createComponent("article list", {
	getMainElement: ({ body }) => body.locator("[data-article-list]"),
	getElements: ({ mainElement }) => ({
		articles: mainElement.locator("article"),
		title: mainElement.locator("h2").first(),
		loading: mainElement.locator("[data-loading]"),
	}),
});

const navigationEngine = createComponent("navigation", {
	getMainElement: ({ body }) => body.locator("nav"),
	getElements: ({ mainElement }) => ({
		menuButton: mainElement.locator("button[data-menu]"),
		menu: mainElement.locator("[data-menu-items]"),
	}),
});

const boardEngine = createComponent("kanban board", {
	getMainElement: ({ body }) => body.locator("[data-board]"),
	getElements: ({ mainElement }) => ({
		task: mainElement.locator("[data-task='review']"),
		doneColumn: mainElement.locator("[data-column='done']"),
	}),
});

export const searchForm = searchFormEngine(website);
export const articleList = articleListEngine(website);
export const navigation = navigationEngine(website);
export const board = boardEngine(website);

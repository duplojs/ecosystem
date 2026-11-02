/**
 * @title createPage
 *
 * Définir un écran navigable et son chemin typé.
 */
import type * as DCommon from "@duplojs/lang/common";
import { createPage, type Website } from "@duplojs/playwright";

declare const website: Website;

const articlePage = createPage("article", {
	makePath: ({ slug }: { slug: string }) => `/articles/${slug}`,
	getMainElement: ({ body }) => body.locator("article"),
	getElements: ({ mainElement }) => ({ title: mainElement.locator("h1") }),
});

// Le paramètre de makePath est requis par la navigation et choisit l’article affiché.
const introduction = await website.iNavigateTo(articlePage, { slug: "introduction" });
await website.iNavigateTo(articlePage, { slug: "testing" });

// La navigation conserve le nom littéral et les éléments propres à cette page.
type _CheckName = DCommon.ExpectType<
	typeof introduction.name,
	"article",
	"strict"
>;
await introduction.elements.title.textContent();

// Une page sans paramètre de chemin se navigue sans argument supplémentaire.
const homePage = createPage("home", {
	makePath: () => "/",
	getMainElement: ({ body }) => body.locator("main"),
});
await website.iNavigateTo(homePage);

/**
 * @title createStepWrapper
 *
 * Envelopper des interactions dans une étape Playwright personnalisée.
 */
import { createComponent, createComponentInteraction, createStepWrapper, type Website } from "@duplojs/playwright";

declare const website: Website;

const articleListEngine = createComponent("article list", {
	getMainElement: ({ body }) => body.locator("[data-article-list]"),
	getElements: ({ mainElement }) => ({ articles: mainElement.locator("article") }),
});
const articleList = articleListEngine(website);
const readArticleId = createComponentInteraction(
	"$component: read id of $element",
	({ element }) => element.getAttribute("data-article-id"),
);

const withStep = createStepWrapper({ readArticleId });
// Le rapport contient l’étape nommée autour de l’étape propre à l’interaction.
const articleId = await withStep("Identifier le premier article").readArticleId(articleList, ["articles", "first"]);
// La valeur runtime est celle de l’interaction enveloppée ; son type public reste any.

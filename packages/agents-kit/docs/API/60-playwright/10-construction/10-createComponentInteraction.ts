/**
 * @title createComponentInteraction
 *
 * Créer une interaction typée sur un élément nommé et une étape Playwright.
 */
import { createComponent, createComponentInteraction, type Website } from "@duplojs/playwright";

declare const website: Website;

const articleListEngine = createComponent("article list", {
	getMainElement: ({ body }) => body.locator("[data-article-list]"),
	getElements: ({ mainElement }) => ({ articles: mainElement.locator("article") }),
});
const articleList = articleListEngine(website);

// Une interaction réutilisable lit l’identifiant métier d’un article de la liste.
const readArticleId = createComponentInteraction(
	"$component: read id of $element",
	({ element }) => element.getAttribute("data-article-id"),
);

// Le tuple sélectionne le premier, le dernier ou l’élément d’indice zéro-based.
const firstId = await readArticleId(articleList, ["articles", "first"]);
await readArticleId(articleList, ["articles", "last"]);
await readArticleId(articleList, ["articles", 1]);
// Au runtime firstId vaut l’attribut ou null ; le retour public est typé Promise<any>.
// Les marqueurs du titre sont remplacés par le nom du composant et la désignation choisie.
// Une clé absente au runtime provoque MissingComponentElementError avant l’étape.

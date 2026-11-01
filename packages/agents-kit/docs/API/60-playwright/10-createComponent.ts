/**
 * @title createComponent
 *
 * Définir une zone réutilisable et ses éléments, méthodes et composants enfants.
 */
import type * as DCommon from "@duplojs/lang/common";
import { createComponent, type Website } from "@duplojs/playwright";

declare const website: Website;

const feedbackEngine = createComponent("feedback", {
	getMainElement: ({ body }) => body.locator("[data-search-feedback]"),
});

const searchFormEngine = createComponent("search form", {
	getMainElement: ({ body }) => body.locator("form[data-search]"),
	getElements: ({ mainElement }) => ({
		query: mainElement.locator("input[name='query']"),
		submit: mainElement.locator("button[type='submit']"),
	}),
	getMethods: ({ elements }) => ({
		async search(query: string) {
			await elements.query.fill(query);
			await elements.submit.click();
		},
	}),
	components: [feedbackEngine],
});

const searchForm = searchFormEngine(website);
// Les éléments retournés par getElements deviennent les seules clés utilisables par les interactions.
type _CheckElementKeys = DCommon.ExpectType<
	keyof typeof searchForm.elements,
	"query" | "submit",
	"strict"
>;
await searchForm.methods.search("TypeScript");

// La recherche par nom vérifie la visibilité de la racine et conserve le type de l’enfant.
const feedback = await searchForm.iWantToSeeComponent("feedback");
type _CheckFeedbackName = DCommon.ExpectType<
	typeof feedback.name,
	"feedback",
	"strict"
>;
// Chaque fabrique enfant recherche sa racine depuis body, pas depuis la racine du parent.
// Les méthodes personnalisées sont exécutées dans des étapes Playwright.

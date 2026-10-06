/**
 * @title Architecturer une suite E2E
 *
 * La suite est rangee comme le site teste, pas comme une liste de locators.
 *
 * Le `Website` correspond a l'application ouverte par Playwright.
 * Une `Page` correspond a un ecran et connait son path.
 * Un `Component` correspond a une zone d'interface que l'on peut reutiliser.
 *
 * Les tests utilisent ces objets pour raconter un parcours. Les locators
 * restent dans les pages et composants, au lieu d'etre eparpilles dans
 * chaque spec.
 */
import { createComponent, createPage } from "@duplojs/playwright";

/*
tests/
	website.ts
	pages/
		home.page.ts
		search.page.ts
	components/
		newsletter.component.ts
	specs/
		home.spec.ts
*/

// Un composant declare son element racine et les elements internes utiles
// pour les actions ou les assertions.
export const newsletterComponent = createComponent(
	"newsletter",
	{
		getMainElement({ body }) {
			return body.locator("[data-newsletter]");
		},
		getElements({ mainElement }) {
			return {
				emailInput: mainElement.locator("input[type='email']"),
				submitButton: mainElement.locator("button[type='submit']"),
				feedback: mainElement.locator("[data-feedback]"),
			};
		},
	},
);

// Une page fonctionne comme un composant, avec un path en plus.
// Elle peut aussi lister les composants disponibles dans son ecran.
export const homePage = createPage(
	"home",
	{
		makePath() {
			return "/";
		},
		getMainElement({ body }) {
			return body.locator("main[data-page='home']");
		},
		getElements({ mainElement }) {
			return {
				title: mainElement.locator("h1"),
			};
		},
		components: [newsletterComponent],
	},
);

// Pour une page avec parametres, la construction de l'URL reste avec
// la definition de l'ecran.
export const articlePage = createPage(
	"article",
	{
		makePath(params: { slug: string }) {
			return `/articles/${params.slug}`;
		},
		getMainElement({ body }) {
			return body.locator("article");
		},
		getElements({ mainElement }) {
			return {
				title: mainElement.locator("h1"),
				content: mainElement.locator("[data-content]"),
			};
		},
	},
);

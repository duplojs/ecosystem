/**
 * @title Architecturer une suite E2E
 *
 * Organisation d’une suite E2E selon les pages et les composants du site testé.
 */
import { createComponent, createPage } from "@duplojs/playwright";

// `Website` représente l’application et son contexte global, `Page` un écran
// navigable et `Component` une zone réutilisable de l’interface.
// Les locators sont déclarés dans ces objets ; les specs utilisent leurs
// éléments et leurs méthodes sans répéter les sélecteurs.
//
// tests/
//   website.ts
//   pages/
//      home.page.ts
//      search.page.ts
//  components/
//      newsletter.component.ts
//  specs/
//      home.spec.ts

// Un composant declare son element racine et les elements utiles au test.
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

// Une page ajoute un path et les composants disponibles sur cet ecran.
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

// Les parametres d'URL restent avec la definition de l'ecran.
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

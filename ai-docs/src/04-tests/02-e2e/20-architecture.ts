/**
 * @title Architecturer une suite E2E
 *
 * Ranger la suite comme le site teste : `Website` pour l'application, `Page`
 * pour un ecran navigable, `Component` pour une zone reutilisable. Les locators
 * restent dans ces objets, pas dans chaque spec.
 */
import { createComponent, createPage } from "@duplojs/playwright";

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

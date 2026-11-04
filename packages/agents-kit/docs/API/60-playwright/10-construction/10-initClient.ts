/**
 * @title Initialiser un client de test Playwright
 *
 * Étendre le client Playwright avec une fixture Website DuploJS utilisable dans les tests.
 */
import { createPage, createWebsite, type Website } from "@duplojs/playwright";
import test from "playwright/test";

interface TestFixtures {
	website: Website;
}

// Playwright fournit une page et un contexte isolés pour chaque test.
export const testClient = test.extend<TestFixtures>({
	async website({ page, context }, use) {
		const website = createWebsite({
			playwrightPage: page,
			playwrightBrowserContext: context,
			envConfig: {
				baseUrl: "http://localhost:3000",
			},
		});

		// La fixture met le Website à disposition pendant le test.
		await use(website);
	},
});

const homePage = createPage("home", {
	makePath: () => "/",
	getMainElement: ({ body }) => body.locator("main"),
});

// Les tests importent testClient et reçoivent la fixture typée parmi les fixtures Playwright.
testClient("le site affiche son titre", async({ website }) => {
	await website.iNavigateTo(homePage);
	await website.iExpectTitleIs(/Accueil/);
});

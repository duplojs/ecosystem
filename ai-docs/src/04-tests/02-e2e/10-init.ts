/**
 * @title Initialiser le client E2E
 *
 * Configuration de l’environnement de test et intégration du site aux fixtures Playwright.
 */
import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DServerCommon from "@duplojs/server/common";
import { createWebsite, type Website } from "@duplojs/playwright";
import test, { defineConfig, devices } from "playwright/test";

const envs = await DServerCommon.environmentVariableOrThrow(
	{
		BASE_URL: DDataStructure.string([DDataStructure.url()]),
		CI: DDataStructure.boolean(),
		RETRIES: DDataStructure.number([DDataStructure.integer()]),
		WORKERS: DDataStructure.number([DDataStructure.integer()]),
	},
	{
		justRead: true,
		includedEnvironmentFiles: [DCommon.infer(".env")],
	},
);

// La configuration reste une configuration Playwright normale.
export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: envs.CI,
	retries: envs.RETRIES,
	workers: envs.WORKERS,
	reporter: [
		[
			"html",
			{
				open: "never",
				outputFolder: "playwright-report",
			},
		],
		["list"],
	],
	use: {
		headless: true,
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});

interface TestFixtures {
	website: Website;
}

// La fixture ajoute `website` aux tests et centralise le contexte du site.
// Elle crée un `Website` par test à partir de la `page` et du `BrowserContext`
// fournis par Playwright. `baseUrl` fixe l’adresse du site ; le hook attend la
// fin du chargement réseau après chaque navigation.
export const testClient = test.extend<TestFixtures>({
	async website({ page, context }, use) {
		const website = createWebsite({
			playwrightPage: page,
			playwrightBrowserContext: context,
			envConfig: {
				baseUrl: envs.BASE_URL,
			},
			hooks: {
				async afterNavigateOnPage() {
					await page.waitForLoadState("networkidle");
				},
			},
		});

		await use(website);
	},
});

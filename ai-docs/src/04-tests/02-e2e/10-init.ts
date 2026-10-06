/**
 * @title Initialiser le client E2E
 *
 * DuploJS Playwright s'utilise depuis un client Playwright etendu.
 * La fixture cree un `Website` pour chaque test avec la `page`
 * Playwright et le `BrowserContext`.
 *
 * Ensuite, le test passe par ce `Website` pour naviguer, verifier
 * l'URL, ajouter des cookies, appliquer un prefix, lancer des hooks
 * ou attendre l'hydratation.
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
// Ici, les variables sont juste chargees avec les outils d'environnement
// DuploJS, comme dans la partie serveur.
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

// La fixture ajoute `website` aux tests.
// `baseUrl` sert ensuite a construire les URLs des pages.
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

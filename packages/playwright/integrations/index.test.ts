import test from "playwright/test";
import { Actions, Assertions, createComponent, createPage, createWebsite, type Website } from "@duplojs/playwright";
import * as DServerCommon from "@duplojs/server/common";

interface TestFixtures {
	website: Website;
}

const testClient = test.extend<TestFixtures>({
	async website({ page, context }, use) {
		const website = createWebsite({
			playwrightPage: page,
			playwrightBrowserContext: context,
			envConfig: {
				baseUrl: "file://",
			},
		});

		await use(website);
	},
});

const newsletterComponent = createComponent(
	"newsletter",
	{
		getMainElement({ body }) {
			return body.locator("[data-newsletter]");
		},
		getElements({ mainElement }) {
			return {
				feedback: mainElement.locator("[data-feedback]"),
				emailInput: mainElement.locator("#email"),
				submitButton: mainElement.locator("[data-submit]"),
			};
		},
	},
);

const homePage = createPage(
	"home",
	{
		makePath() {
			return `${DServerCommon.getCurrentWorkDirectoryOrThrow()}/index.html`;
		},
		getMainElement({ body }) {
			return body.locator("[data-page='home']");
		},
		getElements({ mainElement }) {
			return {
				title: mainElement.locator("h1"),
			};
		},
		components: [newsletterComponent],
	},
);

testClient.describe("integration", () => {
	testClient("integration success flow", async({ website }) => {
		const home = await website.iNavigateTo(homePage);
		await website.iWantToBeOnPage(homePage);
		await website.iExpectTitleIs("Integration playground");
		await Assertions.toHaveText(home, "title", "Welcome to the demo site");
		await website.waitForHydration();

		const newsletter = await home.iWantToSeeComponent("newsletter");

		await Assertions.toHaveText(newsletter, "feedback", "No email submitted yet.");
		await Actions.fill(newsletter, "emailInput", "john@doe.dev");
		await Actions.click(newsletter, "submitButton");
		await Assertions.toContainText(newsletter, "feedback", "john@doe.dev");
		await Assertions.toBeNotBusy(newsletter, "submitButton");
		await Assertions.toHaveValue(newsletter, "emailInput", "john@doe.dev");
	});

	testClient("integration error flow", async({ website }) => {
		const home = await website.iNavigateTo(homePage);
		await website.iWantToBeOnPage(homePage);
		await website.iExpectTitleIs("Integration playground");
		await Assertions.toHaveText(home, ["title", "first"], "Welcome to the demo site");
		await website.waitForHydration();

		const newsletter = await home.iWantToSeeComponent("newsletter");

		await Assertions.toHaveText(newsletter, "feedback", "No email submitted yet.");
		await Actions.click(newsletter, "submitButton");
		await Assertions.toHaveText(newsletter, "feedback", "Email is required.");
		await Assertions.toBeNotBusy(newsletter, "submitButton");
		await Assertions.toHaveValue(newsletter, "emailInput", "");
	});
});

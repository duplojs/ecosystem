/**
 * @title Ecrire un parcours de test
 *
 * Scénarios utilisateur, interactions et vérifications avec les objets du site.
 */
import { Actions, Assertions, createComponent, createPage, type Website } from "@duplojs/playwright";

interface TestFixtures {
	website: Website;
}

declare const testClient: (title: string, body: (fixtures: TestFixtures) => Promise<void>) => void;

const newsletterComponent = createComponent(
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
		getMethods({ elements }) {
			return {
				async subscribe(email: string) {
					await elements!.emailInput.fill(email);
					await elements!.submitButton.click();
				},
			};
		},
	},
);

const homePage = createPage(
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

// Les actions parcourent l'interface, les assertions vérifient son état.
// Les clés passées aux helpers viennent des éléments nommés dans `getElements`.
// `Actions` et `Assertions` limitent ces clés aux éléments déclarés sur l’objet ciblé.
// Le scénario navigue vers une page, récupère son composant, agit sur ses
// éléments puis vérifie le résultat ; une méthode nommée peut regrouper les actions.
testClient("visitor subscribes to the newsletter", async({ website }) => {
	const home = await website.iNavigateTo(homePage);

	await website.iExpectTitleIs(/Home/);
	await Assertions.toHaveText(home, "title", "Welcome");

	const newsletter = await home.iWantToSeeComponent("newsletter");

	await Assertions.toHaveText(newsletter, "feedback", "No email submitted yet.");
	await Actions.fill(newsletter, "emailInput", "jane@duplo.dev");
	await Actions.click(newsletter, "submitButton");
	await Assertions.toContainText(newsletter, "feedback", "jane@duplo.dev");
	await Assertions.toHaveValue(newsletter, "emailInput", "jane@duplo.dev");
});

testClient("visitor cannot submit an empty newsletter form", async({ website }) => {
	const home = await website.iNavigateTo(homePage);
	const newsletter = await home.iWantToSeeComponent("newsletter");

	await Actions.click(newsletter, "submitButton");
	await Assertions.toHaveText(newsletter, "feedback", "Email is required.");
});

testClient("component methods can express repeated intentions", async({ website }) => {
	const home = await website.iNavigateTo(homePage);
	const newsletter = await home.iWantToSeeComponent("newsletter");

	await newsletter.methods.subscribe("jane@duplo.dev");
	await Assertions.toContainText(newsletter, "feedback", "jane@duplo.dev");
});

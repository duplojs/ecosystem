import type { Locator as PlaywrightLocator } from "playwright/test";
import { createPage, type Website, createKind } from "@scripts";

const componentKind = createKind("component");
const pageKind = createKind("page");

function createLocatorMock() {
	return {
		locator() {
			return createLocatorMock();
		},
	} as unknown as PlaywrightLocator;
}

describe("createPage", () => {
	const articlePage = createPage(
		"article",
		{
			makePath({ slug }: { slug: string }) {
				return `/articles/${slug}`;
			},
			getMainElement({ body }) {
				return body.locator("main");
			},
			getElements({ mainElement }) {
				return {
					title: mainElement.locator("h1"),
				};
			},
			getMethods({ elements }) {
				return {
					getTitleLocator() {
						return elements.title;
					},
				};
			},
		},
	);

	it("builds the page", () => {
		const page = articlePage(
			{
				playwrightPage: {
					locator() {
						return createLocatorMock();
					},
				},
			} as unknown as Website,
		);

		expect(componentKind.has(page)).toBe(true);
		expect(pageKind.has(page)).toBe(true);
		expect(componentKind.getValue(page)).toBe("article");
		expect(pageKind.getValue(page)).toBe("article");
		expect(page.name).toBe("article");
		expect(page.makePath({ slug: "double-kind" })).toBe("/articles/double-kind");
		expect(page.elements.title).toBeDefined();
		expect(articlePage.componentName).toBe("article");
	});
});

import { createComponent, createPage, createWebsite, type PageEngine } from "@scripts";

const {
	stepMock,
	expectMock,
	toBeVisibleMock,
	toBeAttachedMock,
	toHaveTitleMock,
	toHaveUrlMock,
} = vi.hoisted(() => {
	const toBeVisibleMock = vi.fn().mockResolvedValue(undefined);
	const toBeAttachedMock = vi.fn().mockResolvedValue(undefined);
	const toHaveTitleMock = vi.fn().mockResolvedValue(undefined);
	const toHaveUrlMock = vi.fn().mockResolvedValue(undefined);
	const expectMock = vi.fn(() => ({
		toBeVisible: toBeVisibleMock,
		toBeAttached: toBeAttachedMock,
		toHaveTitle: toHaveTitleMock,
		toHaveURL: toHaveUrlMock,
	}));

	return {
		stepMock: vi.fn((_stepName: string, callback: () => unknown) => callback()),
		expectMock,
		toBeVisibleMock,
		toBeAttachedMock,
		toHaveTitleMock,
		toHaveUrlMock,
	};
});

vi.mock("playwright/test", () => ({
	default: {
		step: stepMock,
	},
	expect: expectMock,
}));

beforeEach(() => {
	vi.clearAllMocks();
});

describe("createWebsite", () => {
	it("navigates with hooks", async() => {
		const beforeNavigateOnPage = vi.fn().mockResolvedValue(undefined);
		const afterNavigateOnPage = vi.fn().mockResolvedValue(undefined);
		const playwrightPage = {
			goto: vi.fn().mockResolvedValue(undefined),
			locator: vi.fn(() => ({
				locator: vi.fn((selector: string) => ({ selector })),
			})),
		};
		const website = createWebsite({
			playwrightPage: playwrightPage as never,
			playwrightBrowserContext: { addCookies: vi.fn() } as never,
			envConfig: {
				baseUrl: "https://example.com",
				prefix: "admin",
			},
			hooks: {
				beforeNavigateOnPage,
				afterNavigateOnPage,
			},
		});
		const page: PageEngine<"dashboard", { section: string }> = createPage(
			"dashboard",
			{
				makePath: ({ section }: { section: string }) => `/${section}`,
				getMainElement({ body }) {
					return body.locator("main");
				},
			},
		);

		const result = await website.iNavigateTo<typeof page>(page, { section: "users" });

		expect(result.name).toBe("dashboard");
		expect(playwrightPage.goto).toHaveBeenCalledWith("https://example.com/admin/users");
		expect(beforeNavigateOnPage).toHaveBeenCalledTimes(1);
		expect(afterNavigateOnPage).toHaveBeenCalledTimes(1);
		expect(toHaveUrlMock).toHaveBeenCalledWith("https://example.com/admin/users");
		expect(toBeVisibleMock).toHaveBeenCalled();
	});

	it("uses the helpers", async() => {
		const addCookies = vi.fn().mockResolvedValue(undefined);
		const reload = vi.fn().mockResolvedValue(undefined);
		const waitForSelector = vi.fn().mockResolvedValue(undefined);
		const playwrightPage = {
			locator: vi.fn(() => ({
				locator: vi.fn((selector: string) => ({ selector })),
			})),
			reload,
			waitForSelector,
		};
		const website = createWebsite({
			playwrightPage: playwrightPage as never,
			playwrightBrowserContext: { addCookies } as never,
			envConfig: {},
		});
		const page = createPage(
			"dashboard",
			{
				makePath() {
					return "/users";
				},
				getMainElement({ body }) {
					return body.locator("main");
				},
			},
		);
		const component = createComponent(
			"loader",
			{
				getMainElement({ body }) {
					return body.locator("[data-loader]");
				},
			},
		);

		await website.iWantToBeOnPage(page);
		await website.iWantToSee(component);
		await website.iWantToExist(component);
		await website.iExpectTitleIs("Dashboard");
		await website.iExpectUrlIs(/users/);
		await website.addCookies([{ name: "token" } as never]);
		await website.refresh();
		await website.waitForHydration();

		expect(toBeVisibleMock).toHaveBeenCalled();
		expect(toBeAttachedMock).toHaveBeenCalledTimes(1);
		expect(toHaveTitleMock).toHaveBeenCalledWith("Dashboard");
		expect(toHaveUrlMock).toHaveBeenCalledWith(/users/);
		expect(addCookies).toHaveBeenCalledWith([{ name: "token" }]);
		expect(reload).toHaveBeenCalledTimes(1);
		expect(waitForSelector).toHaveBeenCalledWith("[aria-hydrated=\"true\"]", {
			state: "visible",
			timeout: 5000,
		});
	});

	it("updates the prefix", async() => {
		const playwrightPage = {
			goto: vi.fn().mockResolvedValue(undefined),
			locator: vi.fn(() => ({
				locator: vi.fn((selector: string) => ({ selector })),
			})),
		};
		const website = createWebsite({
			playwrightPage: playwrightPage as never,
			playwrightBrowserContext: { addCookies: vi.fn() } as never,
			envConfig: {},
		});
		const page = createPage(
			"dashboard",
			{
				makePath() {
					return "users";
				},
				getMainElement({ body }) {
					return body.locator("main");
				},
			},
		);

		await website.iGoTo(page);
		website.setPrefix("admin");
		await website.iGoTo(page);

		expect(playwrightPage.goto).toHaveBeenNthCalledWith(1, "/users");
		expect(playwrightPage.goto).toHaveBeenCalledWith("/admin/users");
	});
});

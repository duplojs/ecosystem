import { createComponent, type Website } from "@scripts";

const {
	stepMock,
	expectMock,
	toBeVisibleMock,
} = vi.hoisted(() => {
	const toBeVisibleMock = vi.fn().mockResolvedValue(undefined);
	const expectMock = vi.fn(() => ({
		toBeVisible: toBeVisibleMock,
	}));

	return {
		stepMock: vi.fn((_stepName: string, callback: () => unknown) => callback()),
		expectMock,
		toBeVisibleMock,
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

describe("createComponent", () => {
	it("builds the component", async() => {
		const child = createComponent(
			"child",
			{
				getMainElement({ body }) {
					return body.locator("[data-child]");
				},
			},
		);

		const body = {
			locator: vi.fn((selector: string) => ({ selector })),
		};

		const component = createComponent(
			"search-form",
			{
				getMainElement({ body }) {
					return body.locator("main");
				},
				getElements({ mainElement }) {
					return {
						field: mainElement,
					};
				},
				getMethods({ elements }) {
					return {
						getField() {
							return elements.field;
						},
					};
				},
				components: [child],
			},
		)({
			playwrightPage: { locator: vi.fn(() => body) },
		} as unknown as Website);

		expect(component.name).toBe("search-form");
		expect(component.mainElement).toEqual({ selector: "main" });
		expect(component.elements!.field).toEqual({ selector: "main" });
		expect(component.components.child).toBe(child);
		expect(await component.methods!.getField!()).toEqual({ selector: "main" });
		expect(stepMock).toHaveBeenCalledWith(
			"search-form: Call method getField.",
			expect.any(Function),
		);
	});

	it("supports optional fields", () => {
		const body = {
			locator: vi.fn((selector: string) => ({ selector })),
		};

		const component = createComponent(
			"search-form",
			{
				getMainElement({ body }) {
					return body.locator("main");
				},
			},
		)({
			playwrightPage: { locator: vi.fn(() => body) },
		} as unknown as Website);

		expect(component.elements).toBeUndefined();
		expect(component.methods).toBeDefined();
		expect(component.components).toEqual({});
	});

	it("shows a nested component", async() => {
		const body = {
			locator: vi.fn((selector: string) => ({ selector })),
		};

		const child = createComponent(
			"child",
			{
				getMainElement({ body }) {
					return body.locator("[data-child]");
				},
			},
		);

		const component = createComponent(
			"search-form",
			{
				getMainElement({ body }) {
					return body.locator("main");
				},
				components: [child],
			},
		)({
			playwrightPage: { locator: vi.fn(() => body) },
		} as unknown as Website);

		const result = await component.iWantToSeeComponent("child");

		expect(result.name).toBe("child");
		expect(expectMock).toHaveBeenCalledWith({ selector: "[data-child]" });
		expect(toBeVisibleMock).toHaveBeenCalledTimes(1);
	});
});

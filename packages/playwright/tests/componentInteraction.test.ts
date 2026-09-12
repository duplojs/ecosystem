import { createComponentInteraction, createStepWrapper } from "@scripts/componentInteraction";

const { stepMock } = vi.hoisted(() => ({
	stepMock: vi.fn((_stepName: string, callback: () => unknown) => callback()),
}));

vi.mock("playwright/test", () => ({
	default: {
		step: stepMock,
	},
}));

beforeEach(() => {
	vi.clearAllMocks();
});

describe("createComponentInteraction", () => {
	it("runs the step", async() => {
		const element = { click: vi.fn().mockResolvedValue("clicked") };
		const interaction = createComponentInteraction(
			"$component: I click on $element.",
			({ element }) => element.click(),
		);

		const result = await interaction(
			{
				name: "search-form",
				elements: { submit: element },
			} as never,
			"submit",
		);

		expect(result).toBe("clicked");
		expect(element.click).toHaveBeenCalledTimes(1);
		expect(stepMock).toHaveBeenCalledWith(
			"search-form: I click on submit.",
			expect.any(Function),
		);
	});

	it("uses the first matching element", async() => {
		const firstElement = { click: vi.fn().mockResolvedValue("first-clicked") };
		const element = {
			first: vi.fn(() => firstElement),
			last: vi.fn(),
			nth: vi.fn(),
		};
		const interaction = createComponentInteraction(
			"$component: I click on $element.",
			({ element }) => element.click(),
		);

		const result = await interaction(
			{
				name: "search-form",
				elements: { submit: element },
			} as never,
			["submit", "first"],
		);

		expect(result).toBe("first-clicked");
		expect(element.first).toHaveBeenCalledTimes(1);
		expect(element.last).not.toHaveBeenCalled();
		expect(element.nth).not.toHaveBeenCalled();
		expect(firstElement.click).toHaveBeenCalledTimes(1);
		expect(stepMock).toHaveBeenCalledWith(
			"search-form: I click on submit::first.",
			expect.any(Function),
		);
	});

	it("uses the last matching element", async() => {
		const lastElement = { click: vi.fn().mockResolvedValue("last-clicked") };
		const element = {
			first: vi.fn(),
			last: vi.fn(() => lastElement),
			nth: vi.fn(),
		};
		const interaction = createComponentInteraction(
			"$component: I click on $element.",
			({ element }) => element.click(),
		);

		const result = await interaction(
			{
				name: "search-form",
				elements: { submit: element },
			} as never,
			["submit", "last"],
		);

		expect(result).toBe("last-clicked");
		expect(element.first).not.toHaveBeenCalled();
		expect(element.last).toHaveBeenCalledTimes(1);
		expect(element.nth).not.toHaveBeenCalled();
		expect(lastElement.click).toHaveBeenCalledTimes(1);
		expect(stepMock).toHaveBeenCalledWith(
			"search-form: I click on submit::last.",
			expect.any(Function),
		);
	});

	it("uses the nth matching element", async() => {
		const nthElement = { click: vi.fn().mockResolvedValue("nth-clicked") };
		const element = {
			first: vi.fn(),
			last: vi.fn(),
			nth: vi.fn((index: number) => {
				expect(index).toBe(2);
				return nthElement;
			}),
		};
		const interaction = createComponentInteraction(
			"$component: I click on $element.",
			({ element }) => element.click(),
		);

		const result = await interaction(
			{
				name: "search-form",
				elements: { submit: element },
			} as never,
			["submit", 2],
		);

		expect(result).toBe("nth-clicked");
		expect(element.first).not.toHaveBeenCalled();
		expect(element.last).not.toHaveBeenCalled();
		expect(element.nth).toHaveBeenCalledWith(2);
		expect(nthElement.click).toHaveBeenCalledTimes(1);
		expect(stepMock).toHaveBeenCalledWith(
			"search-form: I click on submit::2.",
			expect.any(Function),
		);
	});

	it("throws when the element is missing", () => {
		const interaction = createComponentInteraction(
			"$component: I click on $element.",
			() => undefined,
		);

		expect(() => (interaction as (...args: any[]) => unknown)(
			{
				name: "search-form",
				elements: {},
			},
			"submit",
		)).toThrowError(
			"Missing element \"submit\" on component \"search-form\". Available elements: none.",
		);
	});

	it("throws when elements are undefined", () => {
		const interaction = createComponentInteraction(
			"$component: I click on $element.",
			() => undefined,
		);

		expect(() => (interaction as (...args: any[]) => unknown)(
			{
				name: "search-form",
				elements: undefined,
			},
			"submit",
		)).toThrowError(
			"Missing element \"submit\" on component \"search-form\". Available elements: none.",
		);
	});

	it("lists available elements when the selected element is missing", () => {
		const interaction = createComponentInteraction(
			"$component: I click on $element.",
			() => undefined,
		);

		expect(() => (interaction as (...args: any[]) => unknown)(
			{
				name: "search-form",
				elements: { reset: {} },
			},
			"submit",
		)).toThrowError(
			"Missing element \"submit\" on component \"search-form\". Available elements: reset.",
		);
	});
});

describe("createStepWrapper", () => {
	it("wraps the step", async() => {
		const click = vi.fn().mockResolvedValue("wrapped");
		const wrapper = createStepWrapper({ click });

		const result = await wrapper("custom step").click("component", "element");

		expect(result).toBe("wrapped");
		expect(click).toHaveBeenCalledWith("component", "element");
		expect(stepMock).toHaveBeenCalledWith("custom step", expect.any(Function));
	});
});

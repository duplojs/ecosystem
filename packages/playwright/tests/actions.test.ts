import { Actions } from "@scripts";

const stepMock = vi.fn((_stepName: string, callback: () => unknown) => callback());
const expectMock = vi.fn();

vi.mock("playwright/test", () => ({
	default: {
		step: (...args: Parameters<typeof stepMock>) => stepMock(...args),
	},
	expect: (...args: Parameters<typeof expectMock>) => expectMock(...args),
}));

describe("Actions", () => {
	function mockVisibleExpectation() {
		const toBeVisible = vi.fn().mockResolvedValue(undefined);

		expectMock.mockReturnValue({
			toBeVisible,
		});

		return toBeVisible;
	}

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("click", async() => {
		const element = {
			scrollIntoViewIfNeeded: vi.fn().mockResolvedValue(undefined),
			click: vi.fn().mockResolvedValue("click"),
		};

		mockVisibleExpectation();

		const result = await Actions.click(
			{
				name: "search-form",
				elements: { field: element },
			} as never,
			"field",
		);

		expect(result).toBe("click");
		expect(element.scrollIntoViewIfNeeded).toHaveBeenCalledTimes(1);
		expect(element.click).toHaveBeenCalledWith();
	});

	it("forceClick", async() => {
		const element = {
			scrollIntoViewIfNeeded: vi.fn().mockResolvedValue(undefined),
			click: vi.fn().mockResolvedValue("click"),
		};

		const result = await Actions.forceClick(
			{
				name: "search-form",
				elements: { field: element },
			} as never,
			"field",
		);

		expect(result).toBe("click");
		expect(element.scrollIntoViewIfNeeded).toHaveBeenCalledTimes(0);
		expect(element.click).toHaveBeenCalledWith({ force: true });
	});

	it("hover", async() => {
		const element = {
			scrollIntoViewIfNeeded: vi.fn().mockResolvedValue(undefined),
			hover: vi.fn().mockResolvedValue("hover"),
		};

		mockVisibleExpectation();

		const result = await Actions.hover(
			{
				name: "search-form",
				elements: { field: element },
			} as never,
			"field",
		);

		expect(result).toBe("hover");
		expect(element.scrollIntoViewIfNeeded).toHaveBeenCalledTimes(1);
		expect(element.hover).toHaveBeenCalledWith();
	});

	it("focus", async() => {
		const element = {
			scrollIntoViewIfNeeded: vi.fn().mockResolvedValue(undefined),
			focus: vi.fn().mockResolvedValue("focus"),
		};

		mockVisibleExpectation();

		const result = await Actions.focus(
			{
				name: "search-form",
				elements: { field: element },
			} as never,
			"field",
		);

		expect(result).toBe("focus");
		expect(element.scrollIntoViewIfNeeded).toHaveBeenCalledTimes(1);
		expect(element.focus).toHaveBeenCalledWith();
	});

	it("fill", async() => {
		const element = {
			scrollIntoViewIfNeeded: vi.fn().mockResolvedValue(undefined),
			fill: vi.fn().mockResolvedValue("fill"),
		};

		mockVisibleExpectation();

		const result = await Actions.fill(
			{
				name: "search-form",
				elements: { field: element },
			} as never,
			"field",
			"Ada",
		);

		expect(result).toBe("fill");
		expect(element.scrollIntoViewIfNeeded).toHaveBeenCalledTimes(1);
		expect(element.fill).toHaveBeenCalledWith("Ada");
	});

	it("type", async() => {
		const element = {
			scrollIntoViewIfNeeded: vi.fn().mockResolvedValue(undefined),
			pressSequentially: vi.fn().mockResolvedValue("type"),
		};

		mockVisibleExpectation();

		const result = await Actions.type(
			{
				name: "search-form",
				elements: { field: element },
			} as never,
			"field",
			"Ada",
			{ delay: 20 },
		);

		expect(result).toBe("type");
		expect(element.scrollIntoViewIfNeeded).toHaveBeenCalledTimes(1);
		expect(element.pressSequentially).toHaveBeenCalledWith("Ada", { delay: 20 });
	});

	it("clear", async() => {
		const element = {
			scrollIntoViewIfNeeded: vi.fn().mockResolvedValue(undefined),
			clear: vi.fn().mockResolvedValue("clear"),
		};

		mockVisibleExpectation();

		const result = await Actions.clear(
			{
				name: "search-form",
				elements: { field: element },
			} as never,
			"field",
		);

		expect(result).toBe("clear");
		expect(element.scrollIntoViewIfNeeded).toHaveBeenCalledTimes(1);
		expect(element.clear).toHaveBeenCalledWith();
	});

	it("press", async() => {
		const element = {
			scrollIntoViewIfNeeded: vi.fn().mockResolvedValue(undefined),
			press: vi.fn().mockResolvedValue("press"),
		};

		mockVisibleExpectation();

		const result = await Actions.press(
			{
				name: "search-form",
				elements: { field: element },
			} as never,
			"field",
			"Enter",
		);

		expect(result).toBe("press");
		expect(element.scrollIntoViewIfNeeded).toHaveBeenCalledTimes(1);
		expect(element.press).toHaveBeenCalledWith("Enter");
	});

	it("check", async() => {
		const element = {
			scrollIntoViewIfNeeded: vi.fn().mockResolvedValue(undefined),
			check: vi.fn().mockResolvedValue("check"),
		};

		mockVisibleExpectation();

		const result = await Actions.check(
			{
				name: "search-form",
				elements: { field: element },
			} as never,
			"field",
		);

		expect(result).toBe("check");
		expect(element.scrollIntoViewIfNeeded).toHaveBeenCalledTimes(1);
		expect(element.check).toHaveBeenCalledWith();
	});

	it("uncheck", async() => {
		const element = {
			scrollIntoViewIfNeeded: vi.fn().mockResolvedValue(undefined),
			uncheck: vi.fn().mockResolvedValue("uncheck"),
		};

		mockVisibleExpectation();

		const result = await Actions.uncheck(
			{
				name: "search-form",
				elements: { field: element },
			} as never,
			"field",
		);

		expect(result).toBe("uncheck");
		expect(element.scrollIntoViewIfNeeded).toHaveBeenCalledTimes(1);
		expect(element.uncheck).toHaveBeenCalledWith();
	});

	it("selectOption", async() => {
		const element = {
			scrollIntoViewIfNeeded: vi.fn().mockResolvedValue(undefined),
			selectOption: vi.fn().mockResolvedValue("selectOption"),
		};

		mockVisibleExpectation();

		const result = await Actions.selectOption(
			{
				name: "search-form",
				elements: { field: element },
			} as never,
			"field",
			"admin",
		);

		expect(result).toBe("selectOption");
		expect(element.scrollIntoViewIfNeeded).toHaveBeenCalledTimes(1);
		expect(element.selectOption).toHaveBeenCalledWith("admin");
	});

	it("dragTo", async() => {
		const element = {
			scrollIntoViewIfNeeded: vi.fn().mockResolvedValue(undefined),
			dragTo: vi.fn().mockResolvedValue("dragged"),
		};
		const target = {};
		const toBeVisible = mockVisibleExpectation();

		const result = await Actions.dragTo(
			{
				name: "search-form",
				elements: { field: element },
			} as never,
			"field",
			target as never,
			{ timeout: 1000 },
		);

		expect(result).toBe("dragged");
		expect(element.dragTo).toHaveBeenCalledWith(target, { timeout: 1000 });
		expect(expectMock).toHaveBeenCalledWith(target);
		expect(toBeVisible).toHaveBeenCalledTimes(2);
	});

	it("extractContent", async() => {
		const element = {
			scrollIntoViewIfNeeded: vi.fn().mockResolvedValue(undefined),
			textContent: vi.fn().mockResolvedValue("extractContent"),
		};

		mockVisibleExpectation();

		const result = await Actions.extractContent(
			{
				name: "search-form",
				elements: { field: element },
			} as never,
			"field",
		);

		expect(result).toBe("extractContent");
		expect(element.scrollIntoViewIfNeeded).toHaveBeenCalledTimes(1);
		expect(element.textContent).toHaveBeenCalledWith();
	});

	it("withStep", async() => {
		const element = {
			scrollIntoViewIfNeeded: vi.fn().mockResolvedValue(undefined),
			click: vi.fn().mockResolvedValue(undefined),
		};

		mockVisibleExpectation();

		await Actions.withStep("custom step").click(
			{
				name: "search-form",
				elements: { field: element },
			} as never,
			"field",
		);

		expect(stepMock).toHaveBeenCalledWith("custom step", expect.any(Function));
	});
});

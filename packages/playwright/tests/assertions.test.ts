import { Assertions } from "@scripts";

const stepMock = vi.fn((_stepName: string, callback: () => unknown) => callback());
const expectMock = vi.fn();
const pollMock = vi.fn();

vi.mock("playwright/test", () => ({
	default: {
		step: (...args: Parameters<typeof stepMock>) => stepMock(...args),
	},
	expect: Object.assign(
		(...args: Parameters<typeof expectMock>) => expectMock(...args),
		{
			poll: (...args: Parameters<typeof pollMock>) => pollMock(...args),
		},
	),
}));

function createComponent() {
	const element = {
		scrollIntoViewIfNeeded: vi.fn().mockResolvedValue(undefined),
		count: vi.fn().mockResolvedValue(2),
	};

	return {
		component: {
			name: "search-form",
			elements: { field: element },
		} as never,
		element,
	};
}

describe("Assertions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("toBeVisible", async() => {
		const { component, element } = createComponent();
		const toBeVisible = vi.fn().mockResolvedValue(undefined);

		expectMock.mockReturnValue({
			toBeVisible,
		});

		await Assertions.toBeVisible(component, "field");

		expect(element.scrollIntoViewIfNeeded).toHaveBeenCalledTimes(1);
		expect(toBeVisible).toHaveBeenCalledTimes(1);
	});

	it("toHaveText", async() => {
		const { component } = createComponent();
		const toBeVisible = vi.fn().mockResolvedValue(undefined);
		const toHaveText = vi.fn().mockResolvedValue(undefined);

		expectMock
			.mockReturnValueOnce({ toBeVisible })
			.mockReturnValueOnce({ toHaveText });

		await Assertions.toHaveText(component, "field", "Ada");

		expect(toHaveText).toHaveBeenCalledWith("Ada");
	});

	it("toContainText", async() => {
		const { component } = createComponent();
		const toBeVisible = vi.fn().mockResolvedValue(undefined);
		const toContainText = vi.fn().mockResolvedValue(undefined);

		expectMock
			.mockReturnValueOnce({ toBeVisible })
			.mockReturnValueOnce({ toContainText });

		await Assertions.toContainText(component, "field", /Ada/);

		expect(toContainText).toHaveBeenCalledWith(/Ada/);
	});

	it("toHaveNoText", async() => {
		const { component } = createComponent();
		const toBeVisible = vi.fn().mockResolvedValue(undefined);
		const toHaveText = vi.fn().mockResolvedValue(undefined);

		expectMock
			.mockReturnValueOnce({ toBeVisible })
			.mockReturnValueOnce({ toHaveText });

		await Assertions.toHaveNoText(component, "field");

		expect(toHaveText).toHaveBeenCalledWith("");
	});

	it("toBeHidden", async() => {
		const { component } = createComponent();
		const toBeHidden = vi.fn().mockResolvedValue(undefined);

		expectMock.mockReturnValue({
			toBeHidden,
		});

		await Assertions.toBeHidden(component, "field");

		expect(toBeHidden).toHaveBeenCalledTimes(1);
	});

	it("toHaveQuantity", async() => {
		const { component } = createComponent();
		const toBe = vi.fn().mockResolvedValue(undefined);
		const toBeGreaterThanOrEqual = vi.fn().mockResolvedValue(undefined);
		const toBeLessThanOrEqual = vi.fn().mockResolvedValue(undefined);

		pollMock
			.mockImplementationOnce((callback: () => unknown) => {
				callback();
				return { toBe };
			})
			.mockImplementationOnce((callback: () => unknown) => {
				callback();
				return { toBeGreaterThanOrEqual };
			})
			.mockImplementationOnce((callback: () => unknown) => {
				callback();
				return { toBeLessThanOrEqual };
			});

		await Assertions.toHaveQuantity(component, "field", { quantity: 2 });
		await Assertions.toHaveQuantity(component, "field", {
			quantity: 2,
			operator: "gte",
		});
		await Assertions.toHaveQuantity(component, "field", {
			quantity: 2,
			operator: "lte",
		});

		expect(pollMock).toHaveBeenCalledWith(expect.any(Function), { timeout: 5000 });
		expect(toBe).toHaveBeenCalledWith(2);
		expect(toBeGreaterThanOrEqual).toHaveBeenCalledWith(2);
		expect(toBeLessThanOrEqual).toHaveBeenCalledWith(2);
	});

	it("toBeEnabled", async() => {
		const { component } = createComponent();
		const toBeVisible = vi.fn().mockResolvedValue(undefined);
		const toBeEnabled = vi.fn().mockResolvedValue(undefined);

		expectMock
			.mockReturnValueOnce({ toBeVisible })
			.mockReturnValueOnce({ toBeEnabled });

		await Assertions.toBeEnabled(component, "field");

		expect(toBeEnabled).toHaveBeenCalledTimes(1);
	});

	it("toBeChecked", async() => {
		const { component } = createComponent();
		const toBeVisible = vi.fn().mockResolvedValue(undefined);
		const toBeChecked = vi.fn().mockResolvedValue(undefined);

		expectMock
			.mockReturnValueOnce({ toBeVisible })
			.mockReturnValueOnce({ toBeChecked });

		await Assertions.toBeChecked(component, "field");

		expect(toBeChecked).toHaveBeenCalledTimes(1);
	});

	it("toBeDisabled", async() => {
		const { component } = createComponent();
		const toBeVisible = vi.fn().mockResolvedValue(undefined);
		const toBeDisabled = vi.fn().mockResolvedValue(undefined);

		expectMock
			.mockReturnValueOnce({ toBeVisible })
			.mockReturnValueOnce({ toBeDisabled });

		await Assertions.toBeDisabled(component, "field");

		expect(toBeDisabled).toHaveBeenCalledTimes(1);
	});

	it("toHaveAttribute", async() => {
		const { component } = createComponent();
		const toBeVisible = vi.fn().mockResolvedValue(undefined);
		const toHaveAttribute = vi.fn().mockResolvedValue(undefined);

		expectMock
			.mockReturnValueOnce({ toBeVisible })
			.mockReturnValueOnce({ toHaveAttribute })
			.mockReturnValueOnce({ toBeVisible })
			.mockReturnValueOnce({ toHaveAttribute });

		await Assertions.toHaveAttribute(component, "field", "data-state", "ready");
		await Assertions.toHaveAttribute(component, "field", "data-state");

		expect(toHaveAttribute).toHaveBeenCalledWith("data-state", "ready");
		expect(toHaveAttribute).toHaveBeenCalledWith("data-state", /.+/);
	});

	it("toHaveClass", async() => {
		const { component } = createComponent();
		const toBeVisible = vi.fn().mockResolvedValue(undefined);
		const toHaveClass = vi.fn().mockResolvedValue(undefined);

		expectMock
			.mockReturnValueOnce({ toBeVisible })
			.mockReturnValueOnce({ toHaveClass });

		await Assertions.toHaveClass(component, "field", "is-ready");

		expect(toHaveClass).toHaveBeenCalledWith("is-ready");
	});

	it("toHaveValue", async() => {
		const { component } = createComponent();
		const toBeVisible = vi.fn().mockResolvedValue(undefined);
		const toHaveValue = vi.fn().mockResolvedValue(undefined);

		expectMock
			.mockReturnValueOnce({ toBeVisible })
			.mockReturnValueOnce({ toHaveValue });

		await Assertions.toHaveValue(component, "field", /Ada/);

		expect(toHaveValue).toHaveBeenCalledWith(/Ada/);
	});

	it("toBeBusy", async() => {
		const { component } = createComponent();
		const toBeVisible = vi.fn().mockResolvedValue(undefined);
		const toHaveAttribute = vi.fn().mockResolvedValue(undefined);

		expectMock
			.mockReturnValueOnce({ toBeVisible })
			.mockReturnValueOnce({ toHaveAttribute });

		await Assertions.toBeBusy(component, "field");

		expect(toHaveAttribute).toHaveBeenCalledWith("aria-busy", "true");
	});

	it("toBeNotBusy", async() => {
		const { component } = createComponent();
		const toBeVisible = vi.fn().mockResolvedValue(undefined);
		const toHaveAttribute = vi.fn().mockResolvedValue(undefined);

		expectMock
			.mockReturnValueOnce({ toBeVisible })
			.mockReturnValueOnce({ toHaveAttribute });

		await Assertions.toBeNotBusy(component, "field");

		expect(toHaveAttribute).toHaveBeenCalledWith("aria-busy", "false");
	});

	it("withStep", async() => {
		const { component } = createComponent();
		const toBeVisible = vi.fn().mockResolvedValue(undefined);

		expectMock.mockReturnValue({
			toBeVisible,
		});

		await Assertions.withStep("custom step").toBeVisible(component, "field");

		expect(stepMock).toHaveBeenCalledWith("custom step", expect.any(Function));
	});
});

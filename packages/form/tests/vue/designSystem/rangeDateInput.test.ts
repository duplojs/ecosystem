import * as DChrono from "@duplojs/lang/chrono";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { page } from "vitest/browser";
import { defineComponent, h, ref } from "vue";
import { createForm, useMultiLayout, useSectionLayout, type FormField } from "@V";
import { PrimaryButton, RangeDateInput, templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useRangeDateInput, useTextInput } from "@V/designSystem";
import { createGridTemplates } from "@V/templates/grid";

describe("designSystem/RangeDateInput", () => {
	const mountedWrappers: ReturnType<typeof mount>[] = [];

	afterEach(() => {
		mountedWrappers.forEach(
			(wrapper) => void wrapper.unmount(),
		);
		mountedWrappers.length = 0;
		document.body.innerHTML = "";
	});

	const gridTemplates = createGridTemplates({
		repeat: {
			addButton: templateFormAddButton,
			addLabel: "Add period",
			removeButton: templateFormRemoveButton,
			removeLabel: "Remove period",
			resetButton: templateFormResetButton,
			resetLabel: "Reset period",
		},
		step: {
			nextButton: templateFormNextButton,
			nextLabel: "Next",
			previousButton: templateFormPreviousButton,
			previousLabel: "Previous",
			resetButton: templateFormResetButton,
		},
		union: {
			selectInputKind: templateFormSelect,
		},
	});

	function mountForm(formField: FormField) {
		const useForm = createForm(gridTemplates.useTemplates());
		const form = useForm(formField);
		const checkResult = ref("not checked");
		const Harness = defineComponent({
			setup() {
				async function submit() {
					const result = await form.check();

					checkResult.value = DEither.isRight(result)
						? `success:${JSON.stringify(DEither.unwrapRight(result))}`
						: "error";
				}

				return () => h(
					"section",
					[
						h(
							form.component,
							{ onSubmit: submit },
							{
								default: () => h(
									PrimaryButton,
									{
										label: "Submit",
										type: "submit",
									},
								),
							},
						),
						h(
							"output",
							{ "data-testid": "current-value" },
							JSON.stringify(form.currentValue.value),
						),
						h(
							"output",
							{ "data-testid": "check-result" },
							checkResult.value,
						),
					],
				);
			},
		});

		const wrapper = mount(Harness, {
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		return wrapper;
	}

	function getDateInputLocators() {
		return page
			.getByRole("textbox")
			.all()
			.filter(
				(locator) => {
					const element = locator.element();

					return element instanceof HTMLInputElement && element.type === "date";
				},
			);
	}

	it("renders a date range with bounds and keeps both endpoints synchronized in a real form", async() => {
		mountForm(
			useSectionLayout(
				useMultiLayout({
					name: useTextInput({
						label: "Trip name",
						defaultValue: "Conference",
					}),
					window: useRangeDateInput({
						label: "Trip window",
						defaultValue: () => ({
							from: DChrono.createDate("2025-03-01"),
							to: DChrono.createDate("2025-03-05"),
						}),
						props: {
							min: DChrono.createDate("2025-01-01"),
							max: DChrono.createDate("2025-12-31"),
						},
					}),
				}),
				{ title: "Travel" },
			),
		);

		const dateInputs = getDateInputLocators();
		const fromDateInput = dateInputs[0]!;
		const toDateInput = dateInputs[1]!;

		await expect.element(page.getByText("Trip window")).toBeInTheDocument();
		await expect.element(fromDateInput).toHaveValue("2025-03-01");
		await expect.element(fromDateInput).toHaveAttribute("min", "2025-01-01");
		await expect.element(fromDateInput).toHaveAttribute("max", "2025-03-05");
		await expect.element(toDateInput).toHaveValue("2025-03-05");
		await expect.element(toDateInput).toHaveAttribute("min", "2025-03-01");
		await expect.element(toDateInput).toHaveAttribute("max", "2025-12-31");

		await fromDateInput.fill("2025-04-10");
		await toDateInput.fill("2025-04-20");

		await expect.element(page.getByTestId("current-value")).toHaveTextContent(JSON.stringify({
			name: "Conference",
			window: {
				from: DChrono.createDate("2025-04-10"),
				to: DChrono.createDate("2025-04-20"),
			},
		}));
		await expect.element(toDateInput).toHaveAttribute("min", "2025-04-10");
		await expect.element(fromDateInput).toHaveAttribute("max", "2025-04-20");
	});

	it("returns the selected date range on submit", async() => {
		mountForm(
			useRangeDateInput({
				label: "Booking dates",
				defaultValue: () => ({
					from: DChrono.createDate("2025-07-01"),
					to: DChrono.createDate("2025-07-04"),
				}),
			}),
		);

		const dateInputs = getDateInputLocators();

		await dateInputs[0]!.fill("2025-08-11");
		await dateInputs[1]!.fill("2025-08-18");
		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent(`success:${JSON.stringify({
			from: DChrono.createDate("2025-08-11"),
			to: DChrono.createDate("2025-08-18"),
		})}`);
	});

	it("uses the RangeDateInput preset default value when none is provided", async() => {
		mountForm(
			useRangeDateInput({
				label: "Default range",
			}),
		);

		const dateInputs = getDateInputLocators();
		const fromValue = (dateInputs[0]!.element() as HTMLInputElement).value;
		const toValue = (dateInputs[1]!.element() as HTMLInputElement).value;

		await expect.element(dateInputs[0]!).toHaveValue(fromValue);
		await expect.element(dateInputs[1]!).toHaveValue(toValue);

		const currentRange = JSON.parse(page.getByTestId("current-value").element().textContent!) as {
			from: DChrono.SerializedTheDate;
			to: DChrono.SerializedTheDate;
		};

		expect(DChrono.formatDate(currentRange.from, "YYYY-MM-DD", "UTC")).toBe(fromValue);
		expect(DChrono.formatDate(currentRange.to, "YYYY-MM-DD", "UTC")).toBe(toValue);

		await page.getByRole("button", { name: "Submit" }).click();

		const checkedRange = JSON.parse(page.getByTestId("check-result").element().textContent!.replace("success:", "")) as {
			from: DChrono.SerializedTheDate;
			to: DChrono.SerializedTheDate;
		};

		expect(DChrono.formatDate(checkedRange.from, "YYYY-MM-DD", "UTC")).toBe(fromValue);
		expect(DChrono.formatDate(checkedRange.to, "YYYY-MM-DD", "UTC")).toBe(toValue);
	});

	it("renders the RangeDateInput component markup with empty default endpoints", () => {
		const wrapper = mount(RangeDateInput, {
			props: {
				"onUpdate:modelValue": () => {},
			},
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		const inputs = wrapper.findAll("input");

		expect(wrapper.classes()).toContain("DFV-range-date-input");
		expect(inputs).toHaveLength(2);
		expect(inputs[0]!.attributes("type")).toBe("date");
		expect(inputs[0]!.element.value).toBe("");
		expect(inputs[1]!.attributes("type")).toBe("date");
		expect(inputs[1]!.element.value).toBe("");
	});
});

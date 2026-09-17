import * as DChrono from "@duplojs/lang/chrono";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { page } from "vitest/browser";
import { defineComponent, h, ref } from "vue";
import { createForm, useCheckLayout, useMultiLayout, useSectionLayout, type FormField } from "@V";
import { DateInput, PrimaryButton, templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useDateInput, useTextInput } from "@V/designSystem";
import { createGridTemplates } from "@V/templates/grid";

describe("designSystem/DateInput", () => {
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
			addLabel: "Add date",
			removeButton: templateFormRemoveButton,
			removeLabel: "Remove date",
			resetButton: templateFormResetButton,
			resetLabel: "Reset date",
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

	it("renders date bounds and keeps the selected date synchronized inside a real form", async() => {
		mountForm(
			useSectionLayout(
				useMultiLayout({
					title: useTextInput({
						label: "Event title",
						defaultValue: "Planning",
					}),
					startDate: useDateInput({
						label: "Start date",
						defaultValue: () => DChrono.createDate("2025-05-12"),
						props: {
							min: DChrono.createDate("2025-01-01"),
							max: DChrono.createDate("2025-12-31"),
						},
					}),
				}),
				{ title: "Schedule" },
			),
		);

		const startDateInput = page.getByLabelText("Start date");

		await expect.element(startDateInput).toHaveValue("2025-05-12");
		await expect.element(startDateInput).toHaveAttribute("min", "2025-01-01");
		await expect.element(startDateInput).toHaveAttribute("max", "2025-12-31");

		await startDateInput.fill("2025-06-20");

		await expect.element(page.getByTestId("current-value")).toHaveTextContent(JSON.stringify({
			title: "Planning",
			startDate: DChrono.createDate("2025-06-20"),
		}));
	});

	it("displays validation feedback on submit and clears it after a valid date entry", async() => {
		mountForm(
			useCheckLayout(
				useDateInput({
					label: "Delivery date",
					defaultValue: () => DChrono.createDate("2025-03-10"),
					dataStructure: DDataStructure.date([
						DDataStructure.refine<DChrono.TheDate>(
							(date) => DChrono.toTimestamp(date) >= DChrono.toTimestamp(DChrono.createDate("2025-04-01")),
						).addMessage("Pick an April date or later"),
					]),
				}),
				{},
			),
		);

		const deliveryDateInput = page.getByLabelText("Delivery date");

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByText("Error")).toBeInTheDocument();
		await expect.element(page.getByTestId("check-result")).toHaveTextContent("error");

		await deliveryDateInput.fill("2025-04-15");

		await expect.element(page.getByText("Error")).not.toBeInTheDocument();

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent(`success:${JSON.stringify(DChrono.createDate("2025-04-15"))}`);
	});

	it("uses the DateInput preset default value when none is provided", async() => {
		mountForm(
			useDateInput({
				label: "Default date",
			}),
		);

		const defaultDateInput = page.getByLabelText("Default date");
		const dateValue = (defaultDateInput.element() as HTMLInputElement).value;

		await expect.element(defaultDateInput).toHaveValue(dateValue);
		expect(DChrono.formatDate(JSON.parse(page.getByTestId("current-value").element().textContent!), "YYYY-MM-DD", "UTC")).toBe(dateValue);

		await page.getByRole("button", { name: "Submit" }).click();

		const checkedDate = page.getByTestId("check-result").element().textContent!.replace("success:", "");

		expect(DChrono.formatDate(JSON.parse(checkedDate), "YYYY-MM-DD", "UTC")).toBe(dateValue);
	});

	it("sets the model to null when the browser clears the date value", async() => {
		let updatedValue: DChrono.TheDate | DChrono.SerializedTheDate | null | undefined = undefined;
		const wrapper = mount(DateInput, {
			props: {
				modelValue: DChrono.createDate("2025-06-01"),
				"onUpdate:modelValue": (value) => {
					updatedValue = value;
				},
			},
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		const dateInput = page.getByRole("textbox");

		await dateInput.clear();

		expect(updatedValue).toBeNull();
	});

	it("normalizes a nullish v-model input value to null", async() => {
		let updatedValue: DChrono.TheDate | DChrono.SerializedTheDate | null | undefined = DChrono.createDate("2025-06-01");
		const wrapper = mount(DateInput, {
			props: {
				modelValue: DChrono.createDate("2025-06-01"),
				"onUpdate:modelValue": (value) => {
					updatedValue = value;
				},
			},
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		const input = wrapper.get("input");

		Object.defineProperty(input.element, "value", {
			configurable: true,
			get: () => undefined,
		});

		await input.trigger("input");

		expect(updatedValue).toBeNull();
	});

	it("renders the DateInput component markup without optional bounds", () => {
		const wrapper = mount(DateInput, {
			props: {
				modelValue: DChrono.createDate("2025-06-01"),
				"onUpdate:modelValue": () => {},
			},
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		const input = wrapper.get("input");

		expect(input.classes()).toContain("DFV-date-input");
		expect(input.attributes("type")).toBe("date");
		expect(input.element.value).toBe("2025-06-01");
		expect(input.attributes("min")).toBeUndefined();
		expect(input.attributes("max")).toBeUndefined();
	});
});

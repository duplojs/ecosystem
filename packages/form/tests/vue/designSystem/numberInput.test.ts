import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { page } from "vitest/browser";
import { defineComponent, h, ref } from "vue";
import { createForm, useCheckLayout, useMultiLayout, useSectionLayout, type FormField } from "@V";
import { NumberInput, PrimaryButton, templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useNumberInput, useTextInput } from "@V/designSystem";
import { createGridTemplates } from "@V/templates/grid";

describe("designSystem/NumberInput", () => {
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
			addLabel: "Add value",
			removeButton: templateFormRemoveButton,
			removeLabel: "Remove value",
			resetButton: templateFormResetButton,
			resetLabel: "Reset value",
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

	it("renders numeric props and keeps the number value synchronized in a real form", async() => {
		mountForm(
			useSectionLayout(
				useMultiLayout({
					name: useTextInput({
						label: "Plan name",
						defaultValue: "Starter",
					}),
					seats: useNumberInput({
						label: "Seats",
						defaultValue: 3,
						props: {
							placeholder: "10",
							min: 1,
							max: 50,
							step: 1,
						},
					}),
				}),
				{ title: "Subscription" },
			),
		);

		const seatsInput = page.getByRole("spinbutton", { name: "Seats" });

		await expect.element(seatsInput).toHaveValue(3);
		await expect.element(seatsInput).toHaveAttribute("placeholder", "10");
		await expect.element(seatsInput).toHaveAttribute("min", "1");
		await expect.element(seatsInput).toHaveAttribute("max", "50");
		await expect.element(seatsInput).toHaveAttribute("step", "1");

		await seatsInput.fill("12");

		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"name\":\"Starter\",\"seats\":12}");
	});

	it("uses the minimum value when the user clears a number input", async() => {
		mountForm(
			useNumberInput({
				label: "Quantity",
				defaultValue: 8,
				props: {
					min: 5,
				},
			}),
		);

		const quantityInput = page.getByRole("spinbutton", { name: "Quantity" });

		await expect.element(quantityInput).toHaveValue(8);

		await quantityInput.clear();

		await expect.element(quantityInput).toHaveValue(5);
		await expect.element(page.getByTestId("current-value")).toHaveTextContent("5");
	});

	it("falls back to zero when the user clears a number input without a minimum", async() => {
		mountForm(
			useNumberInput({
				label: "Guests",
				defaultValue: 4,
			}),
		);

		const guestsInput = page.getByRole("spinbutton", { name: "Guests" });

		await guestsInput.clear();

		await expect.element(guestsInput).toHaveValue(0);
		await expect.element(page.getByTestId("current-value")).toHaveTextContent("0");
	});

	it("displays validation feedback on submit and clears it after a valid number entry", async() => {
		mountForm(
			useCheckLayout(
				useNumberInput({
					label: "Budget",
					defaultValue: 1,
					dataStructure: DDataStructure.number([DDataStructure.strictPositive()]),
					props: {
						min: 0,
						step: 1,
					},
				}),
				{},
			),
		);

		const budgetInput = page.getByRole("spinbutton", { name: "Budget" });

		await budgetInput.fill("0");
		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByText("Error")).toBeInTheDocument();
		await expect.element(page.getByTestId("check-result")).toHaveTextContent("error");

		await budgetInput.fill("24");

		await expect.element(page.getByText("Error")).not.toBeInTheDocument();

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:24");
	});

	it("renders the NumberInput component markup without optional props", () => {
		const wrapper = mount(NumberInput, {
			props: {
				modelValue: 7,
				"onUpdate:modelValue": () => {},
			},
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		const input = wrapper.get("input");

		expect(input.classes()).toContain("DFV-number-input");
		expect(input.attributes("type")).toBe("number");
		expect(input.element.value).toBe("7");
		expect(input.attributes("placeholder")).toBeUndefined();
		expect(input.attributes("min")).toBeUndefined();
		expect(input.attributes("max")).toBeUndefined();
		expect(input.attributes("step")).toBeUndefined();
	});
});

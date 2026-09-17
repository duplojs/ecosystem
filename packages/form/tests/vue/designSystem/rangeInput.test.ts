import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { page } from "vitest/browser";
import { defineComponent, h, ref } from "vue";
import { createForm, useMultiLayout, useSectionLayout, type FormField } from "@V";
import { PrimaryButton, RangeInput, templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useRangeInput, useTextInput } from "@V/designSystem";
import { createGridTemplates } from "@V/templates/grid";

describe("designSystem/RangeInput", () => {
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

	it("renders range bounds and keeps the slider value synchronized inside a real form", async() => {
		mountForm(
			useSectionLayout(
				useMultiLayout({
					name: useTextInput({
						label: "Plan name",
						defaultValue: "Starter",
					}),
					discount: useRangeInput({
						label: "Discount",
						defaultValue: 25,
						props: {
							min: 0,
							max: 80,
							step: 5,
						},
					}),
				}),
				{ title: "Offer" },
			),
		);

		const discountSlider = page.getByRole("slider");

		await expect.element(page.getByText("Discount")).toBeInTheDocument();
		await expect.element(discountSlider).toHaveValue("25");
		await expect.element(discountSlider).toHaveAttribute("min", "0");
		await expect.element(discountSlider).toHaveAttribute("max", "80");
		await expect.element(discountSlider).toHaveAttribute("step", "5");

		await discountSlider.fill("45");

		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"name\":\"Starter\",\"discount\":45}");
	});

	it("synchronizes manual numeric entry and submits the selected value", async() => {
		mountForm(
			useRangeInput({
				label: "Volume",
				defaultValue: 10,
				props: {
					min: 0,
					max: 30,
					step: 5,
					manual: true,
					manualDebounce: 0,
				},
			}),
		);

		const volumeSlider = page.getByRole("slider");
		const manualInput = page.getByRole("spinbutton");

		await expect.element(volumeSlider).toHaveValue("10");
		await expect.element(manualInput).toHaveValue(10);

		await manualInput.fill("24");

		await expect.element(volumeSlider).toHaveValue("25");
		await expect.element(manualInput).toHaveValue(25);
		await expect.element(page.getByTestId("current-value")).toHaveTextContent("25");

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:25");
	});

	it("keeps manual values outside the range out of the form state", async() => {
		mountForm(
			useRangeInput({
				label: "Capacity",
				defaultValue: 15,
				props: {
					min: 10,
					max: 30,
					step: 5,
					manual: true,
					manualDebounce: 0,
				},
			}),
		);

		const capacitySlider = page.getByRole("slider");
		const manualInput = page.getByRole("spinbutton");

		await manualInput.fill("40");

		await expect.element(capacitySlider).toHaveValue("15");
		await expect.element(manualInput).toHaveValue(15);
		await expect.element(page.getByTestId("current-value")).toHaveTextContent("15");
	});

	it("uses the RangeInput preset default value when none is provided", async() => {
		mountForm(
			useRangeInput({
				label: "Default range",
			}),
		);

		const defaultSlider = page.getByRole("slider");

		await expect.element(defaultSlider).toHaveValue("0");
		await expect.element(page.getByTestId("current-value")).toHaveTextContent("0");

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:0");
	});

	it("renders the RangeInput component markup without the optional manual input", () => {
		const wrapper = mount(RangeInput, {
			props: {
				modelValue: 7,
				"onUpdate:modelValue": () => {},
			},
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		const input = wrapper.get("input");

		expect(wrapper.classes()).toContain("DFV-range");
		expect(input.classes()).toContain("DFV-range-input");
		expect(input.attributes("type")).toBe("range");
		expect(input.element.value).toBe("7");
		expect(wrapper.find(".DFV-number-input").exists()).toBe(false);
	});
});

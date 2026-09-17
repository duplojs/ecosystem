import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { page } from "vitest/browser";
import { defineComponent, h, ref } from "vue";
import { createForm, useMultiLayout, useSectionLayout, type FormField } from "@V";
import { DualRangeInput, PrimaryButton, templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useDualRangeInput, useTextInput } from "@V/designSystem";
import { createGridTemplates } from "@V/templates/grid";

describe("designSystem/DualRangeInput", () => {
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
			addLabel: "Add range",
			removeButton: templateFormRemoveButton,
			removeLabel: "Remove range",
			resetButton: templateFormResetButton,
			resetLabel: "Reset range",
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

	it("renders both range bounds and keeps the selected interval synchronized inside a real form", async() => {
		mountForm(
			useSectionLayout(
				useMultiLayout({
					name: useTextInput({
						label: "Campaign",
						defaultValue: "Autumn",
					}),
					budget: useDualRangeInput({
						label: "Budget interval",
						defaultValue: () => ({
							start: 20,
							end: 70,
						}),
						props: {
							min: 0,
							max: 100,
							step: 10,
						},
					}),
				}),
				{ title: "Campaign settings" },
			),
		);

		const sliders = page.getByRole("slider").all();
		const startSlider = sliders[0]!;
		const endSlider = sliders[1]!;

		await expect.element(page.getByText("Budget interval")).toBeInTheDocument();
		await expect.element(startSlider).toHaveValue("20");
		await expect.element(startSlider).toHaveAttribute("min", "0");
		await expect.element(startSlider).toHaveAttribute("max", "100");
		await expect.element(startSlider).toHaveAttribute("step", "10");
		await expect.element(endSlider).toHaveValue("70");

		await startSlider.fill("30");
		await endSlider.fill("90");

		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"name\":\"Autumn\",\"budget\":{\"start\":30,\"end\":90}}");
	});

	it("synchronizes manual numeric endpoints and submits the selected interval", async() => {
		mountForm(
			useDualRangeInput({
				label: "Age interval",
				defaultValue: () => ({
					start: 20,
					end: 65,
				}),
				props: {
					min: 0,
					max: 100,
					step: 5,
					manual: true,
					manualDebounce: 0,
				},
			}),
		);

		const sliders = page.getByRole("slider").all();
		const startSlider = sliders[0]!;
		const endSlider = sliders[1]!;
		const manualInputs = page.getByRole("spinbutton").all();
		const startInput = manualInputs[0]!;
		const endInput = manualInputs[1]!;

		await expect.element(startSlider).toHaveValue("20");
		await expect.element(endSlider).toHaveValue("65");
		await expect.element(startInput).toHaveValue(20);
		await expect.element(endInput).toHaveValue(65);

		await startInput.fill("22");
		await endInput.fill("78");

		await expect.element(startSlider).toHaveValue("20");
		await expect.element(endSlider).toHaveValue("80");
		await expect.element(startInput).toHaveValue(20);
		await expect.element(endInput).toHaveValue(80);
		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"start\":20,\"end\":80}");

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:{\"start\":20,\"end\":80}");
	});

	it("keeps crossed manual endpoint attempts out of the form state", async() => {
		mountForm(
			useDualRangeInput({
				label: "Safe interval",
				defaultValue: () => ({
					start: 25,
					end: 75,
				}),
				props: {
					min: 0,
					max: 100,
					step: 5,
					manual: true,
					manualDebounce: 0,
				},
			}),
		);

		const manualInputs = page.getByRole("spinbutton").all();

		await manualInputs[0]!.fill("90");
		await manualInputs[1]!.fill("10");

		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"start\":25,\"end\":75}");
		await expect.element(manualInputs[0]!).toHaveValue(25);
		await expect.element(manualInputs[1]!).toHaveValue(75);
	});

	it("uses the DualRangeInput preset default value when none is provided", async() => {
		mountForm(
			useDualRangeInput({
				label: "Default interval",
			}),
		);

		const sliders = page.getByRole("slider").all();

		await expect.element(sliders[0]!).toHaveValue("0");
		await expect.element(sliders[1]!).toHaveValue("100");
		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"start\":0,\"end\":100}");

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:{\"start\":0,\"end\":100}");
	});

	it("renders the DualRangeInput component markup without the optional manual inputs", () => {
		const wrapper = mount(DualRangeInput, {
			props: {
				modelValue: {
					start: 5,
					end: 15,
				},
				"onUpdate:modelValue": () => {},
			},
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		const inputs = wrapper.findAll("input");

		expect(wrapper.classes()).toContain("DFV-dual-range");
		expect(inputs).toHaveLength(2);
		expect(inputs[0]!.classes()).toContain("DFV-dual-range-input-start");
		expect(inputs[0]!.attributes("type")).toBe("range");
		expect(inputs[0]!.element.value).toBe("5");
		expect(inputs[1]!.classes()).toContain("DFV-dual-range-input-end");
		expect(inputs[1]!.attributes("type")).toBe("range");
		expect(inputs[1]!.element.value).toBe("15");
		expect(wrapper.find(".DFV-number-input").exists()).toBe(false);
	});
});

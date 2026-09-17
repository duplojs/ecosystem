import * as DChrono from "@duplojs/lang/chrono";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { page } from "vitest/browser";
import { defineComponent, h, ref } from "vue";
import { createForm, useMultiLayout, useSectionLayout, type FormField } from "@V";
import { PrimaryButton, RangeTimeInput, templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useRangeTimeInput, useTextInput } from "@V/designSystem";
import { createGridTemplates } from "@V/templates/grid";

describe("designSystem/RangeTimeInput", () => {
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

	function getTimeInputLocators() {
		return page
			.getByRole("textbox")
			.all()
			.filter(
				(locator) => {
					const element = locator.element();

					return element instanceof HTMLInputElement && element.type === "time";
				},
			);
	}

	it("renders a time range with bounds and keeps both endpoints synchronized in a real form", async() => {
		mountForm(
			useSectionLayout(
				useMultiLayout({
					name: useTextInput({
						label: "Workshop name",
						defaultValue: "Architecture review",
					}),
					window: useRangeTimeInput({
						label: "Workshop window",
						defaultValue: () => ({
							from: DChrono.createTime(9, "hour"),
							to: DChrono.createTime(17, "hour"),
						}),
						props: {
							min: DChrono.createTime(8, "hour"),
							max: DChrono.createTime(20, "hour"),
						},
					}),
				}),
				{ title: "Workshop" },
			),
		);

		const timeInputs = getTimeInputLocators();
		const fromTimeInput = timeInputs[0]!;
		const toTimeInput = timeInputs[1]!;

		await expect.element(page.getByText("Workshop window")).toBeInTheDocument();
		await expect.element(fromTimeInput).toHaveValue("09:00");
		await expect.element(fromTimeInput).toHaveAttribute("min", "08:00");
		await expect.element(fromTimeInput).toHaveAttribute("max", "17:00");
		await expect.element(toTimeInput).toHaveValue("17:00");
		await expect.element(toTimeInput).toHaveAttribute("min", "09:00");
		await expect.element(toTimeInput).toHaveAttribute("max", "20:00");

		await fromTimeInput.fill("10:15");
		await toTimeInput.fill("16:45");

		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"name\":\"Architecture review\",\"window\":{\"from\":\"time36900000+\",\"to\":\"time60300000+\"}}");
		await expect.element(toTimeInput).toHaveAttribute("min", "10:15");
		await expect.element(fromTimeInput).toHaveAttribute("max", "16:45");
	});

	it("returns the selected time range on submit", async() => {
		mountForm(
			useRangeTimeInput({
				label: "Focus block",
				defaultValue: () => ({
					from: DChrono.createTime(11, "hour"),
					to: DChrono.createTime(12, "hour"),
				}),
			}),
		);

		const timeInputs = getTimeInputLocators();

		await timeInputs[0]!.fill("13:00");
		await timeInputs[1]!.fill("15:30");
		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:{\"from\":\"time46800000+\",\"to\":\"time55800000+\"}");
	});

	it("uses the RangeTimeInput preset default value when none is provided", async() => {
		mountForm(
			useRangeTimeInput({
				label: "Default range",
			}),
		);

		const timeInputs = getTimeInputLocators();

		await expect.element(timeInputs[0]!).toHaveValue("00:00");
		await expect.element(timeInputs[1]!).toHaveValue("00:00");
		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"from\":\"time0-\",\"to\":\"time0-\"}");

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:{\"from\":\"time0-\",\"to\":\"time0-\"}");
	});

	it("renders the RangeTimeInput component markup with empty default endpoints", () => {
		const wrapper = mount(RangeTimeInput, {
			props: {
				"onUpdate:modelValue": () => {},
			},
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		const inputs = wrapper.findAll("input");

		expect(wrapper.classes()).toContain("DFV-range-time-input");
		expect(inputs).toHaveLength(2);
		expect(inputs[0]!.attributes("type")).toBe("time");
		expect(inputs[0]!.element.value).toBe("");
		expect(inputs[1]!.attributes("type")).toBe("time");
		expect(inputs[1]!.element.value).toBe("");
	});
});

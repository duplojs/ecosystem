import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { page } from "vitest/browser";
import { defineComponent, h, ref, type SetupContext } from "vue";
import { createForm, useCheckLayout, useMultiLayout, useSectionLayout, useUnionLayout, type FormField } from "@V";
import { PrimaryButton, SelectInput, templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useSelectInput, useTextInput } from "@V/designSystem";
import { createGridTemplates } from "@V/templates/grid";

describe("designSystem/SelectInput", () => {
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
			addLabel: "Add choice",
			removeButton: templateFormRemoveButton,
			removeLabel: "Remove choice",
			resetButton: templateFormResetButton,
			resetLabel: "Reset choice",
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

	it("renders options and synchronizes the selected value inside a real form", async() => {
		mountForm(
			useSectionLayout(
				useMultiLayout({
					project: useTextInput({
						label: "Project",
						defaultValue: "Duplo Forms",
					}),
					plan: useSelectInput({
						label: "Plan",
						defaultValue: "starter",
						props: {
							options: [
								{
									value: "starter",
									label: "Starter",
								},
								{
									value: "team",
									label: "Team",
								},
								{
									value: "enterprise",
									label: "Enterprise",
								},
							],
						},
					}),
				}),
				{ title: "Subscription" },
			),
		);

		const planSelect = page.getByRole("combobox");

		await expect.element(page.getByText("Plan")).toBeInTheDocument();
		await expect.element(planSelect).toHaveValue("starter");
		await expect.element(page.getByRole("option", { name: "Starter" })).toBeInTheDocument();
		await expect.element(page.getByRole("option", { name: "Team" })).toBeInTheDocument();
		await expect.element(page.getByRole("option", { name: "Enterprise" })).toBeInTheDocument();

		await planSelect.selectOptions("team");

		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"project\":\"Duplo Forms\",\"plan\":\"team\"}");
	});

	it("displays validation feedback until the user selects an allowed option", async() => {
		mountForm(
			useCheckLayout(
				useSelectInput({
					label: "Billing cycle",
					dataStructure: DDataStructure.literal(["monthly", "yearly"]),
					props: {
						options: [
							{
								value: "monthly",
								label: "Monthly",
							},
							{
								value: "yearly",
								label: "Yearly",
							},
						],
					},
				}),
				{},
			),
		);

		const billingSelect = page.getByRole("combobox");

		await expect.element(page.getByText("Billing cycle")).toBeInTheDocument();
		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByText("Error")).toBeInTheDocument();
		await expect.element(page.getByTestId("check-result")).toHaveTextContent("error");

		await billingSelect.selectOptions("yearly");

		await expect.element(page.getByText("Error")).not.toBeInTheDocument();

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:\"yearly\"");
	});

	it("uses templateFormSelect to switch a union field kind and preserve the selected value", async() => {
		mountForm(
			useUnionLayout(
				[
					[
						"text",
						useTextInput({
							label: "Message",
							defaultValue: "Hello",
						}),
					],
					[
						"plan",
						useSelectInput({
							label: "Plan",
							defaultValue: "starter",
							props: {
								options: [
									{
										value: "starter",
										label: "Starter",
									},
									{
										value: "team",
										label: "Team",
									},
								],
							},
						}),
					],
				],
				{ defaultKind: "text" },
			),
		);

		const unionKindSelect = page.getByRole("combobox");

		await expect.element(unionKindSelect).toHaveValue("text");
		await expect.element(page.getByRole("textbox", { name: "Message" })).toHaveValue("Hello");

		await unionKindSelect.selectOptions("plan");

		const selects = page.getByRole("combobox").all();

		await expect.element(selects[0]!).toHaveValue("plan");
		await expect.element(selects[1]!).toHaveValue("starter");
		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"kind\":\"plan\",\"value\":\"starter\"}");

		await selects[1]!.selectOptions("team");
		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:{\"kind\":\"plan\",\"value\":\"team\"}");
	});

	it("keeps templateFormSelect silent when SelectInput emits a null value", () => {
		const emittedValues: unknown[] = [];
		const Harness = defineComponent({
			setup() {
				return () => templateFormSelect(
					{
						fieldKey: "kind",
						modelValue: "text",
						options: [
							{
								value: "text",
								label: "Text",
							},
							{
								value: "plan",
								label: "Plan",
							},
						],
					},
					{
						attrs: {},
						slots: {},
						emit: (_event, value) => void emittedValues.push(value),
						expose: () => {},
					} satisfies SetupContext<{
						"update:modelValue"(value: string): void;
					}>,
				);
			},
		});
		const wrapper = mount(Harness, {
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		wrapper.getComponent(SelectInput).vm.$emit("update:modelValue", null);
		wrapper.getComponent(SelectInput).vm.$emit("update:modelValue", "plan");

		expect(emittedValues).toStrictEqual(["plan"]);
	});

	it("renders the SelectInput component markup with default props", () => {
		const wrapper = mount(SelectInput, {
			props: {
				modelValue: null,
				options: [],
				"onUpdate:modelValue": () => {},
			},
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		const select = wrapper.get("select");

		expect(select.classes()).toContain("DFV-select-input");
		expect(select.attributes("id")).toBe("select-default");
		expect(select.findAll("option")).toHaveLength(0);
	});
});

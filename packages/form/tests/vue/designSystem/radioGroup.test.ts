import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { page } from "vitest/browser";
import { defineComponent, h, ref } from "vue";
import { createForm, useCheckLayout, useMultiLayout, useSectionLayout, type FormField } from "@V";
import { PrimaryButton, RadioGroup, templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useRadioGroup, useTextInput } from "@V/designSystem";
import { createGridTemplates } from "@V/templates/grid";

describe("designSystem/RadioGroup", () => {
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
			addLabel: "Add frequency",
			removeButton: templateFormRemoveButton,
			removeLabel: "Remove frequency",
			resetButton: templateFormResetButton,
			resetLabel: "Reset frequency",
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

	it("renders labeled options with descriptions and keeps the selected radio synchronized", async() => {
		mountForm(
			useSectionLayout(
				useMultiLayout({
					email: useTextInput({
						label: "Email",
						defaultValue: "team@duplo.test",
					}),
					notificationFrequency: useRadioGroup({
						label: "Notification frequency",
						defaultValue: "daily",
						props: {
							name: "notification-frequency",
							options: [
								{
									value: "instant",
									label: "Instant",
									description: "Send every update",
								},
								{
									value: "daily",
									label: "Daily",
									description: "Send one digest per day",
								},
								{
									value: "weekly",
									label: "Weekly",
									description: "Send one digest per week",
								},
							],
						},
					}),
				}),
				{ title: "Notifications" },
			),
		);

		const dailyRadio = page.getByRole("radio", { name: "Daily Send one digest per day" });
		const weeklyRadio = page.getByRole("radio", { name: "Weekly Send one digest per week" });

		await expect.element(page.getByRole("radiogroup")).toBeInTheDocument();
		await expect.element(dailyRadio).toBeChecked();
		await expect.element(page.getByText("Send every update")).toBeInTheDocument();

		await weeklyRadio.click();

		await expect.element(weeklyRadio).toBeChecked();
		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"email\":\"team@duplo.test\",\"notificationFrequency\":\"weekly\"}");
	});

	it("displays validation feedback until an option is selected", async() => {
		mountForm(
			useCheckLayout(
				useRadioGroup({
					label: "Delivery speed",
					dataStructure: DDataStructure.literal(["standard", "express"]),
					props: {
						name: "delivery-speed",
						options: [
							{
								value: "standard",
								label: "Standard",
							},
							{
								value: "express",
								label: "Express",
							},
						],
					},
				}),
				{},
			),
		);

		const expressRadio = page.getByRole("radio", { name: "Express" });

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByText("Error")).toBeInTheDocument();
		await expect.element(page.getByTestId("check-result")).toHaveTextContent("error");

		await expressRadio.click();

		await expect.element(page.getByText("Error")).not.toBeInTheDocument();

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:\"express\"");
	});

	it("renders the RadioGroup component markup without optional descriptions", () => {
		const wrapper = mount(RadioGroup, {
			props: {
				modelValue: null,
				name: "standalone-priority",
				options: [
					{
						value: "low",
						label: "Low",
					},
					{
						value: "high",
						label: "High",
					},
				],
				"onUpdate:modelValue": () => {},
			},
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		const inputs = wrapper.findAll("input");

		expect(wrapper.get("[role='radiogroup']").classes()).toContain("DFV-radio-group");
		expect(inputs).toHaveLength(2);
		expect(inputs[0]!.attributes("name")).toBe("standalone-priority");
		expect(wrapper.find(".DFV-radio-description").exists()).toBe(false);
	});
});

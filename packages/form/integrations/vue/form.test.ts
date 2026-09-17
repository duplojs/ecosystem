import * as DChrono from "@duplojs/lang/chrono";
import type * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { page } from "vitest/browser";
import { defineComponent, h, ref } from "vue";
import { createForm, type GetCheckedValue, useCheckLayout, useDisabledLayout, useMultiLayout, useRepeatLayout, useSectionLayout, useStepLayout, useUnionLayout } from "@duplojs/form/vue";
import { createGridTemplates } from "@duplojs/form/vueGrid";
import { PrimaryButton, templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useCheckbox, useCheckboxPolicy, useDateInput, useDualRangeInput, useNumberInput, useRadioGroup, useRangeDateInput, useRangeInput, useRangeTimeInput, useSelectInput, useTextareaInput, useTextInput, useTimeInput } from "@duplojs/form/vueDesignSystem";

type MountedWrapper = ReturnType<typeof mount>;

const mountedWrappers: MountedWrapper[] = [];

const gridTemplates = createGridTemplates({
	repeat: {
		addButton: templateFormAddButton,
		addLabel: "Add reference",
		removeButton: templateFormRemoveButton,
		removeLabel: "Remove reference",
		resetButton: templateFormResetButton,
		resetLabel: "Reset reference",
	},
	step: {
		nextButton: templateFormNextButton,
		nextLabel: "Continue",
		previousButton: templateFormPreviousButton,
		previousLabel: "Back",
		resetButton: templateFormResetButton,
		resetLabel: "Reset step",
	},
	union: {
		labels: {
			"Branch A": "Project details",
			"Branch B": "Budget ranges",
		},
		selectInputKind: templateFormSelect,
	},
});

const useForm = createForm(
	gridTemplates.useTemplates(),
);

function createIntegrationForm() {
	return useForm(
		useStepLayout(
			[
				useSectionLayout(
					useDisabledLayout(
						useMultiLayout({
							fullName: useCheckLayout(
								useTextInput({
									label: "Full name",
									defaultValue: "",
									props: {
										placeholder: "Ada Lovelace",
									},
								}),
								{
									refine: (value) => value.trim().length >= 3
										? DEither.ok()
										: DEither.error("Full name must contain at least 3 characters"),
								},
							),
							age: useCheckLayout(
								useNumberInput({
									label: "Age",
									defaultValue: 0,
									props: {
										min: 0,
										max: 120,
									},
								}),
								{
									refine: (value) => value >= 18
										? DEither.ok()
										: DEither.error("Age must be at least 18"),
								},
							),
							newsletter: useCheckbox({
								label: "Newsletter",
								defaultValue: false,
								props: {
									label: "Receive newsletter",
									name: "newsletter",
								},
							}),
							policy: useCheckboxPolicy({
								label: "Policy",
								defaultValue: false,
								props: {
									name: "policy",
									required: true,
									title: "Accept policy",
									description: "Required before continuing.",
									errorMessage: "Policy must be accepted",
								},
							}),
							frequency: useRadioGroup({
								label: "Notification frequency",
								defaultValue: "weekly",
								props: {
									name: "frequency",
									options: [
										{
											value: "daily",
											label: "Daily updates",
										},
										{
											value: "weekly",
											label: "Weekly digest",
										},
										{
											value: "never",
											label: "No notifications",
										},
									],
								},
							}),
						}),
						{ isDisabled: () => false },
					),
					{ title: "Profile" },
				),
				useSectionLayout(
					useUnionLayout(
						[
							[
								"Branch A",
								useMultiLayout({
									service: useCheckLayout(
										useSelectInput({
											label: "Service",
											defaultValue: "standard",
											props: {
												options: [
													{
														value: "standard",
														label: "Standard",
													},
													{
														value: "premium",
														label: "Premium",
													},
												],
											},
										}),
										{
											dataStructure: DDataStructure.string(),
										},
									),
									description: useCheckLayout(
										useTextareaInput({
											label: "Description",
											defaultValue: "",
											props: {
												placeholder: "Describe the request",
											},
										}),
										{
											refine: (value) => value.trim().length >= 10
												? DEither.ok()
												: DEither.error("Description must contain at least 10 characters"),
										},
									),
									references: useRepeatLayout(
										useCheckLayout(
											useTextInput({
												label: "Reference",
												defaultValue: "",
												props: {
													placeholder: "REF-001",
												},
											}),
											{
												refine: (value) => value.trim() !== ""
													? DEither.ok()
													: DEither.error("Reference is required"),
											},
										),
										{
											min: 1,
											max: 3,
										},
									),
								}),
							],
							[
								"Branch B",
								useMultiLayout({
									score: useRangeInput({
										label: "Priority score",
										defaultValue: 30,
										props: {
											min: 0,
											max: 100,
											step: 5,
											manual: true,
											manualDebounce: 0,
										},
									}),
									window: useDualRangeInput({
										label: "Budget window",
										defaultValue: () => ({
											start: 10,
											end: 80,
										}),
										props: {
											min: 0,
											max: 100,
											step: 5,
											manual: true,
											manualDebounce: 0,
										},
									}),
								}),
							],
						],
						{ defaultKind: "Branch A" },
					),
					{ title: "Request" },
				),
				useSectionLayout(
					useMultiLayout({
						startDate: useDateInput({
							label: "Start date",
							defaultValue: () => DChrono.createDate("2026-01-10"),
							props: {
								min: DChrono.createDate("2026-01-01"),
								max: DChrono.createDate("2026-12-31"),
							},
						}),
						deliveryDates: useRangeDateInput({
							label: "Delivery dates",
							defaultValue: () => ({
								from: DChrono.createDate("2026-01-15"),
								to: DChrono.createDate("2026-01-20"),
							}),
						}),
						startTime: useTimeInput({
							label: "Start time",
							defaultValue: () => DChrono.createTime(9, "hour"),
							props: {
								min: DChrono.createTime(8, "hour"),
								max: DChrono.createTime(20, "hour"),
							},
						}),
						deliveryTimes: useRangeTimeInput({
							label: "Delivery times",
							defaultValue: () => ({
								from: DChrono.createTime(10, "hour"),
								to: DChrono.createTime(16, "hour"),
							}),
						}),
					}),
					{ title: "Schedule" },
				),
			],
			{ errorMessageNotAtLastStep: "Complete every step before submitting" },
		),
	);
}

const typeCheckForm = createIntegrationForm();

type ExpectedCheckedValue = readonly [
	(
		| {
			fullName: string;
			age: number;
			newsletter: boolean;
			policy: boolean;
			frequency: string | null;
		}
		| undefined
	),
	(
		| {
			kind: "Branch A";
			value: {
				service: string;
				description: string;
				references: [string, ...string[]];
			};
		}
		| {
			kind: "Branch B";
			value: {
				score: number;
				window: {
					start: number;
					end: number;
				};
			};
		}
	),
	{
		startDate: DChrono.TheDate | DChrono.SerializedTheDate | null;
		deliveryDates: {
			from: DChrono.TheDate | DChrono.SerializedTheDate | null;
			to: DChrono.TheDate | DChrono.SerializedTheDate | null;
		};
		startTime: DChrono.TheTime | DChrono.SerializedTheTime | null;
		deliveryTimes: {
			from: DChrono.TheTime | DChrono.SerializedTheTime | null;
			to: DChrono.TheTime | DChrono.SerializedTheTime | null;
		};
	},
];

type _CheckCheckedValue = DCommon.ExpectType<
	GetCheckedValue<typeof typeCheckForm.check>,
	ExpectedCheckedValue,
	"strict"
>;

function mountForm() {
	const form = createIntegrationForm();
	const checkResult = ref("not checked");

	const Harness = defineComponent({
		setup() {
			async function submit() {
				const result = await form.check();

				checkResult.value = DEither.isRight(result)
					? `success:${JSON.stringify(DEither.unwrapRight(result))}`
					: `error:${JSON.stringify(DEither.unwrapLeft(result))}`;
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

	return {
		form,
		wrapper,
	};
}

async function expectOutputToContain(testId: string, expected: string) {
	await vi.waitFor(
		() => {
			expect(
				document.querySelector(`[data-testid="${testId}"]`)?.textContent ?? "",
			).toContain(expected);
		},
	);
}

async function fillNativeInput(selector: string, index: number, value: string) {
	const input = document.querySelectorAll<HTMLInputElement>(selector)[index];

	expect(input).toBeDefined();
	input!.value = value;
	input!.dispatchEvent(new Event("input", { bubbles: true }));
	input!.dispatchEvent(new Event("change", { bubbles: true }));

	await vi.waitFor(
		() => {
			expect(input!.value).toBe(value);
		},
	);
}

describe("vue form integration", () => {
	afterEach(() => {
		mountedWrappers.forEach(
			(wrapper) => void wrapper.unmount(),
		);
		mountedWrappers.length = 0;
		document.body.innerHTML = "";
	});

	it("blocks progression and displays validation errors before clearing them", async() => {
		mountForm();

		await page.getByRole("button", { name: "Continue" }).click();

		await expect.element(page.getByText("Full name must contain at least 3 characters")).toBeVisible();
		await expect.element(page.getByText("Age must be at least 18")).toBeVisible();
		await expect.element(page.getByText("Policy must be accepted")).toBeVisible();

		await page.getByRole("textbox", { name: "Full name" }).fill("Ada");
		await page.getByRole("spinbutton", { name: "Age" }).fill("18");
		await page.getByRole("checkbox", { name: /Accept policy/ }).click();

		await expect.element(page.getByText("Full name must contain at least 3 characters")).not.toBeInTheDocument();
		await expect.element(page.getByText("Age must be at least 18")).not.toBeInTheDocument();

		await page.getByRole("button", { name: "Continue" }).click();

		await expect.element(page.getByText("Request")).toBeVisible();
		await expect.element(page.getByText("Policy must be accepted")).not.toBeInTheDocument();
	});

	it("keeps values while navigating between steps", async() => {
		mountForm();

		await page.getByRole("textbox", { name: "Full name" }).fill("Ada Lovelace");
		await page.getByRole("spinbutton", { name: "Age" }).fill("37");
		await page.getByRole("checkbox", { name: /Receive newsletter/ }).click();
		await page.getByRole("checkbox", { name: /Accept policy/ }).click();
		await page.getByRole("radio", { name: "Daily updates" }).click();
		await page.getByRole("button", { name: "Continue" }).click();

		await page.getByRole("combobox").all()[1]!.selectOptions("premium");
		await page.getByRole("textbox", { name: "Description" }).fill("A detailed integration request");
		await page.getByRole("textbox", { name: "Reference" }).fill("REF-001");
		await page.getByRole("button", { name: "Back" }).click();

		await expect.element(page.getByRole("textbox", { name: "Full name" })).toHaveValue("Ada Lovelace");
		await expect.element(page.getByRole("spinbutton", { name: "Age" })).toHaveValue(37);
		await expect.element(page.getByRole("checkbox", { name: /Accept policy/ })).toBeChecked();

		await page.getByRole("button", { name: "Continue" }).click();

		await expect.element(page.getByRole("textbox", { name: "Description" })).toHaveValue("A detailed integration request");
		await expect.element(page.getByRole("textbox", { name: "Reference" })).toHaveValue("REF-001");
	});

	it("handles repeat elements and union branch changes", async() => {
		mountForm();

		await page.getByRole("textbox", { name: "Full name" }).fill("Ada Lovelace");
		await page.getByRole("spinbutton", { name: "Age" }).fill("37");
		await page.getByRole("checkbox", { name: /Receive newsletter/ }).click();
		await page.getByRole("checkbox", { name: /Accept policy/ }).click();
		await page.getByRole("radio", { name: "Daily updates" }).click();
		await page.getByRole("button", { name: "Continue" }).click();

		await page.getByRole("button", { name: "Add reference" }).click();

		const references = page.getByRole("textbox", { name: "Reference" }).all();

		await references[0]!.fill("REF-001");
		await references[1]!.fill("REF-002");

		await expectOutputToContain("current-value", "\"references\":[\"REF-001\",\"REF-002\"]");

		await page.getByRole("button", { name: "Remove reference" }).all()[0]!.click();

		await expectOutputToContain("current-value", "\"references\":[\"REF-002\"]");

		await page.getByRole("combobox").all()[0]!.selectOptions("Branch B");

		const rangeNumbers = page.getByRole("spinbutton").all();

		await rangeNumbers[0]!.fill("55");
		await rangeNumbers[1]!.fill("20");
		await rangeNumbers[2]!.fill("70");

		await expectOutputToContain("current-value", "\"kind\":\"Branch B\"");
		await expectOutputToContain("current-value", "\"score\":55");
		await expectOutputToContain("current-value", "\"window\":{\"start\":20,\"end\":70}");

		await page.getByRole("combobox").all()[0]!.selectOptions("Branch A");

		await expect.element(page.getByRole("textbox", { name: "Reference" })).toHaveValue("REF-002");

		await page.getByRole("combobox").all()[0]!.selectOptions("Branch B");

		await expectOutputToContain("current-value", "\"window\":{\"start\":20,\"end\":70}");
	});

	it("completes the whole form and exposes a successful check result", async() => {
		mountForm();

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByText("Complete every step before submitting")).toBeVisible();
		await expectOutputToContain("check-result", "error:");

		await page.getByRole("textbox", { name: "Full name" }).fill("Ada Lovelace");
		await page.getByRole("spinbutton", { name: "Age" }).fill("37");
		await page.getByRole("checkbox", { name: /Receive newsletter/ }).click();
		await page.getByRole("checkbox", { name: /Accept policy/ }).click();
		await page.getByRole("radio", { name: "Daily updates" }).click();
		await page.getByRole("button", { name: "Continue" }).click();
		await page.getByRole("combobox").all()[0]!.selectOptions("Branch B");

		const rangeNumbers = page.getByRole("spinbutton").all();

		await rangeNumbers[0]!.fill("65");
		await rangeNumbers[1]!.fill("25");
		await rangeNumbers[2]!.fill("85");
		await page.getByRole("button", { name: "Continue" }).click();

		await expect.element(page.getByText("Schedule")).toBeVisible();

		await page.getByLabelText("Start date").fill("2026-02-03");
		await fillNativeInput("input[type='date']", 1, "2026-02-10");
		await fillNativeInput("input[type='date']", 2, "2026-02-18");
		await page.getByLabelText("Start time").fill("09:45");
		await fillNativeInput("input[type='time']", 1, "10:30");
		await fillNativeInput("input[type='time']", 2, "15:15");
		await page.getByRole("button", { name: "Submit" }).click();

		await expectOutputToContain("check-result", "success:");
		await expectOutputToContain("check-result", "\"fullName\":\"Ada Lovelace\"");
		await expectOutputToContain("check-result", "\"kind\":\"Branch B\"");
		await expectOutputToContain("check-result", "\"score\":65");
		await expectOutputToContain("check-result", "\"window\":{\"start\":25,\"end\":85}");
	});
});

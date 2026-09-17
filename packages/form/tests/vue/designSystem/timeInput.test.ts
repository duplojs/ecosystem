import * as DChrono from "@duplojs/lang/chrono";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { page } from "vitest/browser";
import { defineComponent, h, ref } from "vue";
import { createForm, useCheckLayout, useMultiLayout, useSectionLayout, type FormField } from "@V";
import { GhostButton, TimeInput, templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useTextInput, useTimeInput } from "@V/designSystem";
import { createGridTemplates } from "@V/templates/grid";

describe("designSystem/TimeInput", () => {
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
			addLabel: "Add time",
			removeButton: templateFormRemoveButton,
			removeLabel: "Remove time",
			resetButton: templateFormResetButton,
			resetLabel: "Reset time",
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
									GhostButton,
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

	it("renders time bounds and keeps the selected time synchronized inside a real form", async() => {
		mountForm(
			useSectionLayout(
				useMultiLayout({
					title: useTextInput({
						label: "Event title",
						defaultValue: "Planning",
					}),
					startAt: useTimeInput({
						label: "Start time",
						defaultValue: () => DChrono.createTime(9, "hour"),
						props: {
							min: DChrono.createTime(8, "hour"),
							max: DChrono.createTime(18, "hour"),
						},
					}),
				}),
				{ title: "Schedule" },
			),
		);

		const startTimeInput = page.getByLabelText("Start time");

		await expect.element(startTimeInput).toHaveValue("09:00");
		await expect.element(startTimeInput).toHaveAttribute("min", "08:00");
		await expect.element(startTimeInput).toHaveAttribute("max", "18:00");

		await startTimeInput.fill("14:30");

		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"title\":\"Planning\",\"startAt\":\"time52200000+\"}");
	});

	it("displays validation feedback on submit and clears it after a valid time entry", async() => {
		mountForm(
			useCheckLayout(
				useTimeInput({
					label: "Reminder time",
					defaultValue: () => DChrono.createTime(10, "hour"),
					dataStructure: DDataStructure.time([
						DDataStructure.refine<DChrono.TheTime>(
							(time) => DChrono.toNative(time) >= DChrono.toNative(DChrono.createTime(12, "hour")),
						).addMessage("Pick an afternoon time"),
					]),
				}),
				{},
			),
		);

		const reminderTimeInput = page.getByLabelText("Reminder time");

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByText("Error")).toBeInTheDocument();
		await expect.element(page.getByTestId("check-result")).toHaveTextContent("error");

		await reminderTimeInput.fill("13:15");

		await expect.element(page.getByText("Error")).not.toBeInTheDocument();

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:\"time47700000+\"");
	});

	it("uses the TimeInput preset default value when none is provided", async() => {
		mountForm(
			useTimeInput({
				label: "Default time",
			}),
		);

		const defaultTimeInput = page.getByLabelText("Default time");

		await expect.element(defaultTimeInput).toHaveValue("00:00");
		await expect.element(page.getByTestId("current-value")).toHaveTextContent("\"time0-\"");

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:\"time0-\"");
	});

	it("sets the model to null when the browser clears the time value", async() => {
		let updatedValue: DChrono.TheTime | DChrono.SerializedTheTime | null | undefined = undefined;
		const wrapper = mount(TimeInput, {
			props: {
				modelValue: DChrono.createTime(6.5, "hour"),
				"onUpdate:modelValue": (value) => {
					updatedValue = value;
				},
			},
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		const timeInput = page.getByRole("textbox");

		await timeInput.clear();

		expect(updatedValue).toBeNull();
	});

	it("normalizes a nullish v-model input value to null", async() => {
		let updatedValue: DChrono.TheTime | DChrono.SerializedTheTime | null | undefined = DChrono.createTime(6.5, "hour");
		const wrapper = mount(TimeInput, {
			props: {
				modelValue: DChrono.createTime(6.5, "hour"),
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

	it("renders the TimeInput component markup without optional bounds", () => {
		const wrapper = mount(TimeInput, {
			props: {
				modelValue: DChrono.createTime(6.5, "hour"),
				"onUpdate:modelValue": () => {},
			},
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		const input = wrapper.get("input");

		expect(input.classes()).toContain("DFV-time-input");
		expect(input.attributes("type")).toBe("time");
		expect(input.element.value).toBe("06:30");
		expect(input.attributes("min")).toBeUndefined();
		expect(input.attributes("max")).toBeUndefined();
	});
});

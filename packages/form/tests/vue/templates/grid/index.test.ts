import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import { createForm, createInput } from "@V";
import { useCheckLayout, useMultiLayout, useRepeatLayout, useSectionLayout, useStepLayout, useUnionLayout } from "@V/layouts";
import { createGridTemplates } from "@V/templates/grid";
import { templateKind } from "@V/template";
import type { FunctionButtonComponent, FunctionSelectInputComponent } from "@V/types";
import TextInput from "@test-utils/vue/TextInput.vue";

const TestButton: FunctionButtonComponent = (props) => h(
	"button",
	{
		class: "test-grid-button",
		disabled: props.disabled,
		type: "button",
	},
	props.label,
);

const TestSelect = ((
	props,
	context,
) => h(
	"select",
	{
		id: "test-grid-select",
		onChange: (event) => {
			context.emit("update:modelValue", (event.target as HTMLSelectElement).value);
		},
		value: props.modelValue,
	},
	props.options.map(
		(option) => h(
			"option",
			{ value: option.value },
			option.label,
		),
	),
)) as FunctionSelectInputComponent;

TestSelect.emits = ["update:modelValue"];

function createTestGridTemplates() {
	return createGridTemplates({
		form: {
			gap: 12,
			maxColumns: 4,
		},
		input: {
			columns: 2,
			hideEmptyMessageError: true,
		},
		multi: {
			columns: 3,
			gap: 8,
			maxColumns: 5,
		},
		check: {
			columns: 4,
			gap: 6,
			hideEmptyMessageError: true,
			maxColumns: 6,
		},
		section: {
			columns: 5,
			gap: 10,
			maxColumns: 7,
		},
		repeat: {
			addButton: TestButton,
			addLabel: "Add item",
			columns: 6,
			gap: 14,
			maxColumns: 8,
			removeButton: TestButton,
			removeLabel: "Remove item",
			repeatElementColumn: 2,
			repeatElementMaxColumn: 3,
			resetButton: TestButton,
			resetLabel: "Reset item",
		},
		step: {
			hideEmptyMessageError: true,
			nextButton: TestButton,
			nextLabel: "Next step",
			previousButton: TestButton,
			previousLabel: "Previous step",
			resetButton: TestButton,
			resetLabel: "Reset step",
		},
		union: {
			columns: 7,
			gap: 16,
			labels: {
				other: "Other kind",
				text: "Text kind",
			},
			maxColumns: 9,
			selectInputKind: TestSelect,
		},
	});
}

describe("templates/grid/index", () => {
	describe("logic", () => {
		it("creates every grid template factory and a complete templates object", () => {
			const gridTemplates = createTestGridTemplates();
			const templates = gridTemplates.useTemplates();

			expect(templateKind.has(gridTemplates.useFormTemplate())).toBe(true);
			expect(templateKind.has(gridTemplates.useInputTemplate())).toBe(true);
			expect(templateKind.has(gridTemplates.useMultiTemplate())).toBe(true);
			expect(templateKind.has(gridTemplates.useCheckTemplate())).toBe(true);
			expect(templateKind.has(gridTemplates.useRepeatTemplate())).toBe(true);
			expect(templateKind.has(gridTemplates.useUnionTemplate())).toBe(true);
			expect(templateKind.has(gridTemplates.useStepByStepTemplate())).toBe(true);
			expect(templateKind.has(gridTemplates.useSectionTemplate())).toBe(true);
			expect(Object.keys(templates).sort()).toStrictEqual([
				"check",
				"form",
				"input",
				"multi",
				"repeat",
				"section",
				"step",
				"union",
			]);
		});
	});

	describe("rendering", () => {
		it("renders grid templates through a complete form composition", async() => {
			const gridTemplates = createTestGridTemplates();
			const templates = gridTemplates.useTemplates();
			const useInput = createInput(TextInput, {
				defaultValue: "text",
			});
			const { component, currentValue, check } = createForm(templates)(
				useCheckLayout(
					useSectionLayout(
						useMultiLayout({
							repeated: useRepeatLayout(useInput(), {
								min: 1,
								max: 2,
							}),
							stepped: useStepLayout(
								[
									useInput({ defaultValue: "first-step" }),
									useInput({ defaultValue: "second-step" }),
								],
								{
									errorMessageNotAtLastStep: "Finish every step",
								},
							),
							unioned: useUnionLayout(
								[
									["text", useInput({ defaultValue: "union-text" })],
									["other", useInput({ defaultValue: "union-other" })],
								],
								{
									defaultKind: "text",
								},
							),
						}),
						{
							title: "Grid section",
						},
					),
					{
						refine: () => DEither.error("Grid check error"),
					},
				),
			);
			const wrapper = mount(component, {
				slots: {
					default: () => h("button", { id: "grid-submit" }, "Submit"),
				},
			});

			expect(wrapper.find("form.DFV-grid-form").exists()).toBe(true);
			expect(wrapper.find("#grid-submit").text()).toBe("Submit");
			expect(wrapper.find("label").text()).toBe("Grid section");
			expect(wrapper.findAll(".DFV-grid-container").length).toBeGreaterThan(1);
			expect(wrapper.find("#test-grid-select").findAll("option").map((option) => option.text())).toStrictEqual([
				"Text kind",
				"Other kind",
			]);
			expect(wrapper.findAll(".test-grid-button").map((button) => button.text())).toEqual(
				expect.arrayContaining([
					"Add item",
					"Remove item",
					"Reset item",
					"Next step",
					"Previous step",
					"Reset step",
				]),
			);

			currentValue.value.stepped.currentStep = 1;

			await expect(check()).resolves.toStrictEqual(
				DEither.error([{ key: "FRM_CHK" }]),
			);

			expect(wrapper.find(".DFV-grid-error").text()).toBe("Grid check error");

			await wrapper.find(".DFV-grid-repeat-add .test-grid-button").trigger("click");

			expect(currentValue.value.repeated).toStrictEqual(["text", "text"]);
		});
	});
});

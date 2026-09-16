import { mount } from "@vue/test-utils";
import { h, type SetupContext } from "vue";
import type { FunctionButtonComponent } from "@V/types";
import GridStepByStepTemplate from "@V/templates/grid/components/GridStepByStepTemplate.vue";

const TestButton = ((
	props: {
		label?: string;
		disabled?: boolean;
	},
	context: SetupContext,
) => h(
	"button",
	{
		class: "test-button",
		disabled: props.disabled,
		onClick: context.attrs.onClick as ((event: MouseEvent) => void) | undefined,
		type: "button",
	},
	props.label,
)) as FunctionButtonComponent;

describe("templates/grid/components/GridStepByStepTemplate", () => {
	it("renders the active field, error, custom labels and emits actions", async() => {
		const wrapper = mount(GridStepByStepTemplate, {
			props: {
				fieldKey: "STEP",
				getCurrentValue: () => undefined,
				getCurrentStep: () => 1,
				getErrorMessageNotAtLastStep: () => "Finish steps",
				getFormFields: () => [],
				isLastStep: () => false,
				nextButton: TestButton,
				nextLabel: "Next step",
				previousButton: TestButton,
				previousLabel: "Previous step",
				resetButton: TestButton,
				resetLabel: "Reset step",
				stepQuantity: 3,
			},
			slots: {
				formField: "<span id=\"step-field\">field</span>",
			},
		});
		const buttons = wrapper.findAll(".test-button");

		expect(wrapper.find("#step-field").text()).toBe("field");
		expect(wrapper.find(".DFV-step-error").text()).toBe("Finish steps");
		expect(buttons.map((button) => button.text())).toStrictEqual([
			"Previous step",
			"Reset step",
			"Next step",
		]);
		expect(buttons[0]?.attributes("disabled")).toBeUndefined();
		expect(buttons[2]?.attributes("disabled")).toBeUndefined();

		await buttons[0]?.trigger("click");
		await buttons[1]?.trigger("click");
		await buttons[2]?.trigger("click");

		expect(wrapper.emitted("previousStep")).toHaveLength(1);
		expect(wrapper.emitted("resetStep")).toHaveLength(1);
		expect(wrapper.emitted("nextStep")).toHaveLength(1);
	});

	it("uses default navigation labels and disables edge navigation", () => {
		const firstStepWrapper = mount(GridStepByStepTemplate, {
			props: {
				fieldKey: "STEP",
				getCurrentValue: () => undefined,
				getCurrentStep: () => 0,
				getErrorMessageNotAtLastStep: () => null,
				getFormFields: () => [],
				isLastStep: () => false,
				nextButton: TestButton,
				previousButton: TestButton,
				resetButton: TestButton,
				stepQuantity: 2,
			},
		});
		const lastStepWrapper = mount(GridStepByStepTemplate, {
			props: {
				fieldKey: "STEP",
				getCurrentValue: () => undefined,
				getCurrentStep: () => 1,
				getErrorMessageNotAtLastStep: () => null,
				getFormFields: () => [],
				hideEmptyMessageError: true,
				isLastStep: () => true,
				nextButton: TestButton,
				previousButton: TestButton,
				resetButton: TestButton,
				stepQuantity: 2,
			},
		});

		expect(firstStepWrapper.find(".DFV-step-error").exists()).toBe(true);
		expect(firstStepWrapper.findAll(".test-button").map((button) => button.text())).toStrictEqual([
			"Previous",
			"",
			"Next",
		]);
		expect(firstStepWrapper.findAll(".test-button")[0]?.attributes("disabled")).toBe("");
		expect(lastStepWrapper.find(".DFV-step-error").exists()).toBe(false);
		expect(lastStepWrapper.findAll(".test-button")[2]?.attributes("disabled")).toBe("");
	});
});

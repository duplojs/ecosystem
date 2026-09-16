import { mount } from "@vue/test-utils";
import { h, type SetupContext } from "vue";
import type { FunctionButtonComponent } from "@V/types";
import GridRepeatTemplate from "@V/templates/grid/components/GridRepeatTemplate.vue";

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

describe("templates/grid/components/GridRepeatTemplate", () => {
	it("renders repeated fields, custom buttons, disabled states and grid styles", async() => {
		const wrapper = mount(GridRepeatTemplate, {
			props: {
				addButton: TestButton,
				addLabel: "Add item",
				columns: 2,
				fieldKey: "REPEAT",
				gap: 12,
				getCurrentValue: () => undefined,
				getFormFields: () => [
					h("span", { id: "first-field" }, "first"),
					h("span", { id: "second-field" }, "second"),
				],
				getFormFieldsQuantity: () => 2,
				max: 3,
				maxColumns: 4,
				min: 1,
				removeButton: TestButton,
				removeLabel: "Remove item",
				repeatElementColumn: 3,
				repeatElementMaxColumn: 5,
				resetButton: TestButton,
				resetLabel: "Reset item",
			},
		});
		const buttons = wrapper.findAll(".test-button");

		expect(wrapper.attributes("style")).toContain("--DFV-grid-columns: 2;");
		expect(wrapper.find(".DFV-grid-container").attributes("style")).toContain("--DFV-grid-max-columns: 4;");
		expect(wrapper.find(".DFV-grid-container").attributes("style")).toContain("--DFV-grid-gap: 12px;");
		expect(wrapper.findAll(".DFV-grid-repeat-element")).toHaveLength(2);
		expect(wrapper.findAll(".DFV-grid-repeat-element")[0]?.attributes("style")).toContain("--DFV-grid-columns: 3;");
		expect(wrapper.find(".DFV-grid-repeat-container").attributes("style")).toContain("--DFV-grid-max-columns: 5;");
		expect(wrapper.find("#first-field").text()).toBe("first");
		expect(wrapper.find("#second-field").text()).toBe("second");
		expect(buttons.map((button) => button.text())).toStrictEqual([
			"Reset item",
			"Remove item",
			"Reset item",
			"Remove item",
			"Add item",
		]);
		expect(buttons[1]?.attributes("disabled")).toBeUndefined();
		expect(buttons[4]?.attributes("disabled")).toBeUndefined();

		await buttons[0]?.trigger("click");
		await buttons[1]?.trigger("click");
		await buttons[4]?.trigger("click");

		expect(wrapper.emitted("resetElement")).toStrictEqual([[0]]);
		expect(wrapper.emitted("removeElement")).toStrictEqual([[0]]);
		expect(wrapper.emitted("addElement")).toHaveLength(1);
	});

	it("uses default labels and disables remove when the minimum is reached", () => {
		const wrapper = mount(GridRepeatTemplate, {
			props: {
				addButton: TestButton,
				fieldKey: "REPEAT",
				getCurrentValue: () => undefined,
				getFormFields: () => [h("span", "field")],
				getFormFieldsQuantity: () => 1,
				max: 1,
				min: 1,
				removeButton: TestButton,
				resetButton: TestButton,
			},
		});
		const buttons = wrapper.findAll(".test-button");

		expect(buttons.map((button) => button.text())).toStrictEqual([
			"Reset",
			"Remove",
			"Add",
		]);
		expect(buttons[1]?.attributes("disabled")).toBe("");
		expect(buttons[2]?.attributes("disabled")).toBe("");
		expect(wrapper.find(".DFV-grid-container").attributes("style")).toBeUndefined();
		expect(wrapper.find(".DFV-grid-repeat-element").attributes("style")).toBeUndefined();
		expect(wrapper.find(".DFV-grid-repeat-container").attributes("style")).toBeUndefined();
	});
});

import { mount } from "@vue/test-utils";
import { h } from "vue";
import type { FunctionSelectInputComponent } from "@V/types";
import GridUnionTemplate from "@V/templates/grid/components/GridUnionTemplate.vue";

const TestSelect = ((
	props,
	context,
) => h(
	"select",
	{
		id: "union-select",
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

describe("templates/grid/components/GridUnionTemplate", () => {
	it("renders the select, labels, form field and grid styles", async() => {
		const wrapper = mount(GridUnionTemplate, {
			props: {
				columns: 2,
				fieldKey: "UNION",
				gap: 14,
				getCurrentValue: () => undefined,
				getCurrentKind: () => "text",
				kinds: ["text", "other"],
				labels: {
					text: "Text label",
				},
				maxColumns: 5,
				selectInputKind: TestSelect,
			},
			slots: {
				formField: "<span id=\"union-field\">field</span>",
			},
		});

		expect(wrapper.find("#union-field").text()).toBe("field");
		expect(wrapper.attributes("style")).toContain("--DFV-grid-columns: 2;");
		expect(wrapper.find(".DFV-grid-container").attributes("style")).toContain("--DFV-grid-max-columns: 5;");
		expect(wrapper.find(".DFV-grid-container").attributes("style")).toContain("--DFV-grid-gap: 14px;");
		expect(wrapper.findAll("option").map((option) => option.text())).toStrictEqual([
			"Text label",
			"other",
		]);

		await wrapper.find("#union-select").setValue("other");

		expect(wrapper.emitted("changeKind")).toStrictEqual([["other"]]);
	});

	it("uses raw kind labels and omits the gap style by default", () => {
		const wrapper = mount(GridUnionTemplate, {
			props: {
				fieldKey: "UNION",
				getCurrentValue: () => undefined,
				getCurrentKind: () => "text",
				kinds: ["text"],
				selectInputKind: TestSelect,
			},
		});

		expect(wrapper.find("option").text()).toBe("text");
		expect(wrapper.attributes("style")).toBeUndefined();
		expect(wrapper.find(".DFV-grid-container").attributes("style")).toBeUndefined();
	});
});

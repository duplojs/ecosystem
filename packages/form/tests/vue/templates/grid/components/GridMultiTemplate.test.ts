import { mount } from "@vue/test-utils";
import GridMultiTemplate from "@V/templates/grid/components/GridMultiTemplate.vue";

describe("templates/grid/components/GridMultiTemplate", () => {
	it("renders form fields with grid styles", () => {
		const wrapper = mount(GridMultiTemplate, {
			props: {
				columns: 2,
				fieldKey: "MULTI",
				gap: 6,
				getCurrentValue: () => undefined,
				getFormFields: () => [],
				maxColumns: 5,
			},
			slots: {
				formField: "<span id=\"multi-field\">field</span>",
			},
		});

		expect(wrapper.find("#multi-field").text()).toBe("field");
		expect(wrapper.attributes("style")).toContain("--DFV-grid-max-columns: 5;");
		expect(wrapper.attributes("style")).toContain("--DFV-grid-gap: 6px;");
		expect(wrapper.attributes("style")).toContain("--DFV-grid-columns: 2;");
	});

	it("omits the gap style when no gap is provided", () => {
		const wrapper = mount(GridMultiTemplate, {
			props: {
				fieldKey: "MULTI",
				getCurrentValue: () => undefined,
				getFormFields: () => [],
			},
		});

		expect(wrapper.attributes("style")).toBeUndefined();
	});
});

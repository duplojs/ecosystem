import { mount } from "@vue/test-utils";
import GridCheckTemplate from "@V/templates/grid/components/GridCheckTemplate.vue";

describe("templates/grid/components/GridCheckTemplate", () => {
	it("renders form fields, error message and grid styles", () => {
		const wrapper = mount(GridCheckTemplate, {
			props: {
				columns: 2,
				fieldKey: "CHECK",
				gap: 8,
				getCurrentValue: () => undefined,
				getErrorMessage: () => "Check error",
				maxColumns: 4,
			},
			slots: {
				formField: "<span id=\"check-field\">field</span>",
			},
		});

		expect(wrapper.find("#check-field").text()).toBe("field");
		expect(wrapper.attributes("style")).toContain("--DFV-grid-columns: 2;");
		expect(wrapper.attributes("style")).toContain("--DFV-grid-gap: 8px;");
		expect(wrapper.find(".DFV-grid-container").attributes("style")).toContain("--DFV-grid-max-columns: 4;");
		expect(wrapper.find(".DFV-grid-container").attributes("style")).toContain("--DFV-grid-gap: 8px;");
		expect(wrapper.find(".DFV-grid-error").text()).toBe("Check error");
	});

	it("renders an empty error by default when the message is null", () => {
		const wrapper = mount(GridCheckTemplate, {
			props: {
				fieldKey: "CHECK",
				getCurrentValue: () => undefined,
				getErrorMessage: () => null,
			},
		});

		expect(wrapper.find(".DFV-grid-error").exists()).toBe(true);
		expect(wrapper.find(".DFV-grid-error").text()).toBe("");
	});

	it("hides an empty error and omits the gap style when configured to do so", () => {
		const wrapper = mount(GridCheckTemplate, {
			props: {
				fieldKey: "CHECK",
				getCurrentValue: () => undefined,
				getErrorMessage: () => null,
				hideEmptyMessageError: true,
			},
		});

		expect(wrapper.find(".DFV-grid-error").exists()).toBe(false);
		expect(wrapper.attributes("style")).toBeUndefined();
		expect(wrapper.find(".DFV-grid-container").attributes("style")).toBeUndefined();
	});
});

import { mount } from "@vue/test-utils";
import GridSectionTemplate from "@V/templates/grid/components/GridSectionTemplate.vue";

describe("templates/grid/components/GridSectionTemplate", () => {
	it("renders the title, form fields and grid styles", () => {
		const wrapper = mount(GridSectionTemplate, {
			props: {
				columns: 3,
				fieldKey: "SECTION",
				gap: 10,
				getCurrentValue: () => undefined,
				maxColumns: 6,
				title: "Section title",
			},
			slots: {
				formField: "<span id=\"section-field\">field</span>",
			},
		});

		expect(wrapper.find("label").attributes("for")).toBe("SECTION");
		expect(wrapper.find("label").text()).toBe("Section title");
		expect(wrapper.find("#section-field").text()).toBe("field");
		expect(wrapper.attributes("style")).toContain("--DFV-grid-columns: 3;");
		expect(wrapper.find(".DFV-grid-container").attributes("style")).toContain("--DFV-grid-max-columns: 6;");
		expect(wrapper.find(".DFV-grid-container").attributes("style")).toContain("--DFV-grid-gap: 10px;");
	});

	it("omits the title and gap style when they are not provided", () => {
		const wrapper = mount(GridSectionTemplate, {
			props: {
				fieldKey: "SECTION",
				getCurrentValue: () => undefined,
			},
		});

		expect(wrapper.find("label").exists()).toBe(false);
		expect(wrapper.attributes("style")).toBeUndefined();
		expect(wrapper.find(".DFV-grid-container").attributes("style")).toBeUndefined();
	});
});

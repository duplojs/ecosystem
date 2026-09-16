import { mount } from "@vue/test-utils";
import GridInputTemplate from "@V/templates/grid/components/GridInputTemplate.vue";

describe("templates/grid/components/GridInputTemplate", () => {
	it("renders the label, input slot, error message and column style", () => {
		const wrapper = mount(GridInputTemplate, {
			props: {
				columns: 2,
				fieldKey: "FIELD",
				getCurrentValue: () => undefined,
				getErrorMessage: () => "Invalid field",
				getLabel: () => "Field label",
			},
			slots: {
				input: "<input id=\"field-input\" />",
			},
		});

		expect(wrapper.find("label").attributes("for")).toBe("FIELD");
		expect(wrapper.find("label").text()).toBe("Field label");
		expect(wrapper.find("#field-input").exists()).toBe(true);
		expect(wrapper.find(".DFV-grid-error").text()).toBe("Invalid field");
		expect(wrapper.attributes("style")).toContain("--DFV-grid-columns: 2;");
	});

	it("renders an empty error by default when the message is null", () => {
		const wrapper = mount(GridInputTemplate, {
			props: {
				fieldKey: "FIELD",
				getCurrentValue: () => undefined,
				getErrorMessage: () => null,
			},
		});

		expect(wrapper.find("label").exists()).toBe(false);
		expect(wrapper.find(".DFV-grid-error").exists()).toBe(true);
		expect(wrapper.find(".DFV-grid-error").text()).toBe("");
	});

	it("hides an empty error when configured to do so", () => {
		const wrapper = mount(GridInputTemplate, {
			props: {
				fieldKey: "FIELD",
				getCurrentValue: () => undefined,
				getErrorMessage: () => null,
				hideEmptyMessageError: true,
			},
		});

		expect(wrapper.find(".DFV-grid-error").exists()).toBe(false);
	});

	it("does not render an error block when no error getter is provided", () => {
		const wrapper = mount(GridInputTemplate, {
			props: {
				fieldKey: "FIELD",
				getCurrentValue: () => undefined,
			},
		});

		expect(wrapper.find(".DFV-grid-error").exists()).toBe(false);
	});
});

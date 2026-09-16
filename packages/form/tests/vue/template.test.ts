import { mount } from "@vue/test-utils";
import { h } from "vue";
import { createTemplate, templateKind } from "@V/template";
import InputTemplate from "@test-utils/vue/templates/InputTemplate.vue";

describe("template", () => {
	describe("logic", () => {
		it("creates a template kind exposing getVNode", () => {
			const template = createTemplate("input", InputTemplate)();

			expect(templateKind.has(template)).toBe(true);
			expect(template.getVNode).toEqual(expect.any(Function));
		});
	});

	describe("rendering", () => {
		it("merges default, local and render classes while rendering props and slots", () => {
			const template = createTemplate(
				"input",
				InputTemplate,
				{
					props: {
						class: "default-class",
					},
				},
			)({
				class: "local-class",
			});
			const wrapper = mount(
				{
					render: () => template.getVNode(
						{
							fieldKey: "FIELD",
							class: "render-class",
							getCurrentValue: () => "current",
						},
						{
							input: () => [h("span", { id: "slot-content" }, "slot")],
						},
					),
				},
			);

			expect(wrapper.find("#current-value-input").text()).toBe("current");
			expect(wrapper.find("#slot-content").text()).toBe("slot");
			expect(wrapper.classes()).toEqual(
				expect.arrayContaining([
					"default-class",
					"local-class",
					"render-class",
					"DFV-template_input",
					"DFV-deep_FIELD",
				]),
			);
		});
	});
});

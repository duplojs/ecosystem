import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { createForm, createTemplate } from "@V";
import { useSectionLayout } from "@V/layouts";
import { createTestFormField } from "@test-utils/vue/formField";
import SectionTemplateAlt from "@test-utils/vue/templates/SectionTemplateAlt.vue";
import { testTemplates } from "@test-utils/vue/templates";

describe("useSectionLayout", () => {
	describe("logic", () => {
		it("delegates check reset and dispose to the wrapped field", async() => {
			const reset = vi.fn();
			const dispose = vi.fn();
			const { check, reset: resetForm, dispose: disposeForm } = createForm(testTemplates)(
				useSectionLayout(
					createTestFormField("default", {
						check: () => Promise.resolve(DEither.success("checked")),
						onReset: reset,
						onDispose: dispose,
					}),
				),
			);

			await expect(check()).resolves.toStrictEqual(
				DEither.success("checked"),
			);

			resetForm();
			disposeForm();

			expect(reset).toHaveBeenCalledTimes(1);
			expect(dispose).toHaveBeenCalledTimes(1);
		});
	});

	describe("rendering", () => {
		it("renders the wrapped field through the section template", () => {
			const localTemplate = createTemplate("section", SectionTemplateAlt)();
			const localTemplateSpy = vi.spyOn(localTemplate, "getVNode");
			const { component } = createForm(testTemplates)(
				useSectionLayout(
					createTestFormField("default"),
					{
						class: "section-class",
						template: localTemplate,
						title: "Section title",
					},
				),
			);
			const wrapper = mount(component);

			expect(wrapper.find("#field-FRM_SEC").text()).toBe("default");
			expect(wrapper.find("#local-section-current-value").text()).toBe("default");
			expect(wrapper.find(".section-class").exists()).toBe(true);
			expect(localTemplateSpy.mock.calls[0]?.[0].title).toBe("Section title");
		});

		it("uses the context section template by default", () => {
			const contextTemplateSpy = vi.spyOn(testTemplates.section, "getVNode");
			const { component } = createForm(testTemplates)(
				useSectionLayout(createTestFormField("default")),
			);

			mount(component);

			expect(contextTemplateSpy).toHaveBeenCalledTimes(1);
		});
	});
});

import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { type Ref } from "vue";
import { createForm, createInput, createTemplate } from "@V";
import { createFormField, type DetailsError } from "@V/formField";
import { useRepeatLayout } from "@V/layouts";
import { createTestFormField } from "@test-utils/vue/formField";
import TextInput from "@test-utils/vue/TextInput.vue";
import RepeatTemplateAlt from "@test-utils/vue/templates/RepeatTemplateAlt.vue";
import { testTemplates } from "@test-utils/vue/templates";

describe("useRepeatLayout", () => {
	describe("logic", () => {
		it("creates default values from min and checks rendered instances", async() => {
			const { currentValue, check } = createForm(testTemplates)(
				useRepeatLayout(
					createTestFormField("default", {
						check: (value) => Promise.resolve(DEither.success(`checked-${value}`)),
					}),
					{
						min: 2,
						max: 3,
					},
				),
			);

			expect(currentValue.value).toStrictEqual(["default", "default"]);
			await expect(check()).resolves.toStrictEqual(
				DEither.success(["checked-default", "checked-default"]),
			);
		});

		it("returns child errors and delegates reset and dispose to cached fields", async() => {
			const reset = vi.fn();
			const dispose = vi.fn();
			const { check, reset: resetForm, dispose: disposeForm } = createForm(testTemplates)(
				useRepeatLayout(
					createTestFormField("default", {
						check: (_value, key) => Promise.resolve(
							DEither.error<DetailsError>(DCommon.cast([{ key }])),
						),
						onReset: reset,
						onDispose: dispose,
					}),
					{
						min: 1,
						max: 1,
					},
				),
			);

			await expect(check()).resolves.toStrictEqual(
				DEither.error([{ key: "FRM_REP-0" }]),
			);

			resetForm();
			disposeForm();

			expect(reset).toHaveBeenCalledTimes(1);
			expect(dispose).toHaveBeenCalledTimes(1);
		});
	});

	describe("rendering", () => {
		it("adds, removes and resets elements within min and max bounds", async() => {
			const useInput = createInput(TextInput, {
				defaultValue: "default",
			});
			const { component, currentValue } = createForm(testTemplates)(
				useRepeatLayout(useInput(), {
					min: 1,
					max: 2,
				}),
			);
			const wrapper = mount(component);

			expect(wrapper.find("#repeat-form-fields-count").text()).toBe("1");
			expect(wrapper.find("#repeat-min").text()).toBe("1");
			expect(wrapper.find("#repeat-max").text()).toBe("2");

			await wrapper.find("#repeat-add").trigger("click");

			expect(currentValue.value).toStrictEqual(["default", "default"]);
			expect(wrapper.find("#repeat-form-fields-count").text()).toBe("2");

			await wrapper.find("#repeat-add").trigger("click");
			expect(currentValue.value).toStrictEqual(["default", "default"]);

			await wrapper.findAll("#test-text-input")[0]!.setValue("updated");
			await wrapper.find("#repeat-reset-0").trigger("click");

			expect(currentValue.value[0]).toBe("default");

			await wrapper.find("#repeat-remove-0").trigger("click");
			await wrapper.find("#repeat-remove-0").trigger("click");

			expect(currentValue.value).toStrictEqual(["default"]);
		});

		it("ignores reset events for missing elements", async() => {
			const { component, currentValue } = createForm(testTemplates)(
				useRepeatLayout(
					createInput(TextInput, {
						defaultValue: "default",
					})(),
					{
						max: 1,
						template: createTemplate("repeat", RepeatTemplateAlt)(),
					},
				),
			);
			const wrapper = mount(component);

			await wrapper.find("#local-repeat-add").trigger("click");
			await wrapper.find("#local-repeat-reset-invalid").trigger("click");

			expect(currentValue.value).toStrictEqual(["default"]);
		});

		it("ignores writes from cached fields outside the current range", async() => {
			const refs: Record<string, Ref<string>> = {};
			const field = createFormField(
				(modelValue, parentKey) => {
					refs[parentKey] = modelValue as Ref<string>;

					return {
						check: () => Promise.resolve(DEither.success(modelValue.value)),
						reset: () => undefined,
						dispose: () => undefined,
						getVNode: () => null,
					};
				},
				"default",
			);
			const { component, currentValue } = createForm(testTemplates)(
				useRepeatLayout(field, {
					max: 2,
				}),
			);
			const wrapper = mount(component);

			await wrapper.find("#repeat-add").trigger("click");
			await wrapper.find("#repeat-add").trigger("click");
			await wrapper.find("#repeat-remove-0").trigger("click");

			expect(refs["FRM_REP-1"]!.value).toBe("default");

			refs["FRM_REP-1"]!.value = "ignored";

			expect(currentValue.value).toStrictEqual(["default"]);
		});

		it("exposes the current form field quantity to templates", () => {
			const localTemplate = createTemplate("repeat", RepeatTemplateAlt)();
			const templateSpy = vi.spyOn(localTemplate, "getVNode");
			const { component } = createForm(testTemplates)(
				useRepeatLayout(
					createTestFormField("default"),
					{
						min: 1,
						max: 1,
						template: localTemplate,
					},
				),
			);

			mount(component);

			expect(templateSpy.mock.calls[0]?.[0].getFormFieldsQuantity()).toBe(1);
		});
	});
});

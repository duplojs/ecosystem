import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import { createForm, createInput, createTemplate } from "@V";
import { createFormField } from "@V/formField";
import TextInput from "@test-utils/vue/TextInput.vue";
import TextInputWithExpose from "@test-utils/vue/TextInputWithExpose.vue";
import FormTemplate from "@test-utils/vue/templates/FormTemplate.vue";
import { testTemplates } from "@test-utils/vue/templates";

describe("form", () => {
	describe("logic", () => {
		it("initializes current value from a clone of the field default value", () => {
			const defaultValue = {
				value: "default",
			};
			const field = createFormField(
				(modelValue) => ({
					check: () => Promise.resolve(DEither.success(modelValue.value)),
					reset: () => undefined,
					dispose: () => undefined,
					getVNode: () => null,
				}),
				defaultValue,
			);
			const { currentValue } = createForm(testTemplates)(field);

			expect(currentValue.value).toStrictEqual(defaultValue);
			expect(currentValue.value).not.toBe(defaultValue);
		});

		it("delegates check reset and dispose to the field instance", async() => {
			const useForm = createForm(testTemplates);
			const useInput = createInput(TextInputWithExpose, {
				defaultValue: "default",
			});
			const { component, currentValue, check, reset, dispose } = useForm(
				useInput(),
			);
			const wrapper = mount(component);

			await wrapper.find("#test-text-input").setValue("updated");

			await expect(check()).resolves.toStrictEqual(
				DEither.success("test"),
			);

			reset();
			await DCommon.timeout();

			expect(currentValue.value).toBe("reset");

			dispose();
			await nextTick();

			expect(currentValue.value).toBe("reset");
			expect(wrapper.find("#text-input-with-expose-disposed").exists()).toBe(true);
		});

		it("resets the field value to a clone of the default value", () => {
			const defaultValue = {
				value: "default",
			};
			const field = createFormField(
				(modelValue) => ({
					check: () => Promise.resolve(DEither.success(modelValue.value)),
					reset: () => {
						modelValue.value = {
							value: "field reset",
						};
					},
					dispose: () => undefined,
					getVNode: () => null,
				}),
				defaultValue,
			);
			const { currentValue, reset } = createForm(testTemplates)(field);

			currentValue.value = {
				value: "updated",
			};
			reset();

			expect(currentValue.value).toStrictEqual(defaultValue);
			expect(currentValue.value).not.toBe(defaultValue);
		});

		it("gives fields access to rendered form slots", async() => {
			const field = createFormField<
				string,
				string,
				{
					action: {
						fieldKey: string;
						value: string;
						update(value: string): void;
					};
				}
			>(
				(modelValue, _parentKey, context) => ({
					check: () => Promise.resolve(DEither.success(modelValue.value)),
					reset: () => undefined,
					dispose: () => undefined,
					getVNode: () => h(
						"div",
						[
							context.getSlot("action", {
								fieldKey: "custom-key",
								value: modelValue.value,
								update: (value) => {
									modelValue.value = value;
								},
							}),
							h(
								"small",
								{ id: "missing-slot" },
								context.getSlot("missing", {
									fieldKey: "custom-key",
									value: modelValue.value,
									update: () => undefined,
								}) === null
									? "null"
									: "not-null",
							),
						],
					),
				}),
				"default",
			);
			const { component, currentValue } = createForm(testTemplates)(field);
			const wrapper = mount(component, {
				slots: {
					action: ({ fieldKey, value, update }) => h(
						"button",
						{
							id: "slot-action",
							type: "button",
							onClick: () => update("from slot"),
						},
						`${fieldKey}:${value}`,
					),
				},
			});

			expect(wrapper.find("#slot-action").text()).toBe("custom-key:default");
			expect(wrapper.find("#missing-slot").text()).toBe("null");

			await wrapper.find("#slot-action").trigger("click");

			expect(currentValue.value).toBe("from slot");
		});
	});

	describe("rendering", () => {
		it("renders the form template with field, submitter slot and synchronized current value", async() => {
			const useForm = createForm(testTemplates);
			const useInput = createInput(TextInput, {
				defaultValue: "default",
			});
			const { component, currentValue, check } = useForm(
				useInput(),
				{
					class: "custom-form-class",
				},
			);
			const wrapper = mount(component, {
				attrs: {
					class: "mount-form-class",
				},
				slots: {
					default: "<button id=\"submitter\">submit</button>",
				},
			});

			expect(wrapper.find("form").exists()).toBe(true);
			expect(wrapper.find("form").classes()).toEqual(
				expect.arrayContaining([
					"mount-form-class",
					"custom-form-class",
					"DFV-template_form",
					"DFV-deep_FRM",
				]),
			);
			expect(wrapper.find("#submitter").exists()).toBe(true);
			expect(wrapper.find("#current-value-form").text()).toBe("default");

			await wrapper.find("#test-text-input").setValue("SuperText");

			expect(currentValue.value).toBe("SuperText");
			expect(wrapper.find("#current-value-form").text()).toBe("SuperText");
			await expect(check()).resolves.toStrictEqual(
				DEither.success("SuperText"),
			);
		});

		it("uses a local form template instead of the default one", () => {
			const useForm = createForm(testTemplates);
			const localTemplate = createTemplate("form", FormTemplate)();
			const defaultTemplateSpy = vi.spyOn(testTemplates.form, "getVNode");
			const localTemplateSpy = vi.spyOn(localTemplate, "getVNode");
			const useInput = createInput(TextInput, {
				defaultValue: "default",
			});
			const { component } = useForm(
				useInput(),
				{
					template: localTemplate,
				},
			);

			const wrapper = mount(component);

			expect(wrapper.find("form").exists()).toBe(true);
			expect(localTemplateSpy).toHaveBeenCalledTimes(1);
			expect(defaultTemplateSpy).not.toHaveBeenCalled();
		});

		it("emits submit from the rendered form template", async() => {
			const useForm = createForm(testTemplates);
			const onSubmit = vi.fn();
			const useInput = createInput(TextInput, {
				defaultValue: "default",
			});
			const { component } = useForm(useInput());
			const wrapper = mount(component, {
				attrs: {
					onSubmit,
				},
			});

			await wrapper.find("form").trigger("submit");

			expect(onSubmit).toHaveBeenCalledTimes(1);
		});
	});
});

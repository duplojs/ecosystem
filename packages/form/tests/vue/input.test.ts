import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import { createInput, createTemplate } from "@V";
import TextInput from "@test-utils/vue/TextInput.vue";
import TextInputWithErrorExpose from "@test-utils/vue/TextInputWithErrorExpose.vue";
import TextInputWithExpose from "@test-utils/vue/TextInputWithExpose.vue";
import InputTemplate from "@test-utils/vue/templates/InputTemplate.vue";
import { testTemplates } from "@test-utils/vue/templates";

describe("input", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("logic", () => {
		it("creates a form field with default and local default value support", () => {
			const useInput = createInput(TextInput, {
				defaultValue: () => "default",
			});
			const defaultField = useInput();
			const localFunctionField = useInput({
				defaultValue: () => "local",
			});
			const localValueField = useInput({
				defaultValue: "value",
			});

			expect(defaultField.defaultValue).toBe("default");
			expect(localFunctionField.defaultValue).toBe("local");
			expect(localValueField.defaultValue).toBe("value");
		});

		it("checks exposed component result before the model value", async() => {
			const useInput = createInput(TextInputWithExpose, {
				defaultValue: "default",
			});
			const modelValue = ref("model");
			const instance = useInput().new(
				modelValue,
				"FIELD",
				{
					templates: testTemplates,
					getSlot: () => null,
					errorInterpreter: DDataStructure.createErrorInterpreter(),
					codecs: undefined,
				},
			);
			const wrapper = mount({
				render: () => instance.getVNode(),
			});

			await wrapper.find("#test-text-input").setValue("updated");

			await expect(instance.check()).resolves.toStrictEqual(
				DEither.success("test"),
			);
			expect(modelValue.value).toBe("updated");
		});

		it("returns exposed component check errors without data structure parsing", async() => {
			const useInput = createInput(TextInputWithErrorExpose as unknown as typeof TextInput, {
				defaultValue: "default",
			});
			const instance = useInput({
				dataStructure: DDataStructure.string([DDataStructure.minCharacters(10)]),
			}).new(
				ref("valid-by-model"),
				"FIELD",
				{
					templates: testTemplates,
					getSlot: () => null,
					errorInterpreter: DDataStructure.createErrorInterpreter(),
					codecs: undefined,
				},
			);

			mount({
				render: () => instance.getVNode(),
			});

			await expect(instance.check()).resolves.toStrictEqual(
				DEither.error([{ key: "inner-field" }]),
			);
		});

		it("parses successful component values with the data structure", async() => {
			const useInput = createInput(TextInput, {
				defaultValue: "42",
			});
			const instance = useInput({
				dataStructure: DDataStructure.number(),
				codecs: DDataStructure.codecsString,
			}).new(
				ref("42"),
				"FIELD",
				{
					templates: testTemplates,
					getSlot: () => null,
					errorInterpreter: DDataStructure.createErrorInterpreter(),
					codecs: undefined,
				},
			);

			mount({
				render: () => instance.getVNode(),
			});

			await expect(instance.check()).resolves.toStrictEqual(
				DEither.success(42),
			);
		});

		it("resets errors and ignores model updates after dispose", async() => {
			const useInput = createInput(TextInput, {
				defaultValue: "ok",
			});
			const modelValue = ref("ko");
			const instance = useInput({
				dataStructure: DDataStructure.string([DDataStructure.minCharacters(3).addMessage("Too short")]),
			}).new(
				modelValue,
				"FIELD",
				{
					templates: testTemplates,
					getSlot: () => null,
					errorInterpreter: DDataStructure.createErrorInterpreter(),
					codecs: undefined,
				},
			);
			const wrapper = mount({
				render: () => instance.getVNode(),
			});

			expect(DEither.isLeft(await instance.check())).toBe(true);
			expect(wrapper.find("#input-error-message").text()).toBe("Error");

			instance.reset();
			await DCommon.timeout();
			expect(wrapper.find("#input-error-message").text()).toBe("");

			instance.dispose();
			await wrapper.find("#test-text-input").setValue("after dispose");

			expect(modelValue.value).toBe("ko");
		});

		it("checks again on model update when an error is displayed", async() => {
			const useInput = createInput(TextInput, {
				defaultValue: "ko",
			});
			const modelValue = ref("ko");
			const instance = useInput({
				dataStructure: DDataStructure.string([DDataStructure.minCharacters(3)]),
			}).new(
				modelValue,
				"FIELD",
				{
					templates: testTemplates,
					getSlot: () => null,
					errorInterpreter: DDataStructure.createErrorInterpreter(),
					codecs: undefined,
				},
			);
			const wrapper = mount({
				render: () => instance.getVNode(),
			});

			expect(DEither.isLeft(await instance.check())).toBe(true);
			expect(wrapper.find("#input-error-message").text()).toBe("Error");

			await wrapper.find("#test-text-input").setValue("valid");
			await DCommon.timeout();

			expect(wrapper.find("#input-error-message").text()).toBe("");
		});

		it("uses the first data structure issue message when it exists", async() => {
			const useInput = createInput(TextInput, {
				defaultValue: "value",
			});
			const instance = useInput({
				dataStructure: {
					asyncParse: () => Promise.resolve(
						DEither.error({
							issues: [
								{
									message: "Custom message",
								},
							],
						}),
					),
				} as unknown as DDataStructure.Structure,
			}).new(
				ref("value"),
				"FIELD",
				{
					templates: testTemplates,
					getSlot: () => null,
					errorInterpreter: DDataStructure.createErrorInterpreter(),
					codecs: undefined,
				},
			);
			const wrapper = mount({
				render: () => instance.getVNode(),
			});

			expect(DEither.isLeft(await instance.check())).toBe(true);
			expect(wrapper.find("#input-error-message").text()).toBe("Custom message");
		});

		it("uses the fallback error message when the first issue message is undefined", async() => {
			const useInput = createInput(TextInput, {
				defaultValue: "value",
			});
			const instance = useInput({
				dataStructure: {
					asyncParse: () => Promise.resolve(
						DEither.error({
							issues: [
								{
									message: undefined,
								},
							],
						}),
					),
				} as unknown as DDataStructure.Structure,
			}).new(
				ref("value"),
				"FIELD",
				{
					templates: testTemplates,
					getSlot: () => null,
					errorInterpreter: DDataStructure.createErrorInterpreter(),
					codecs: undefined,
				},
			);
			const wrapper = mount({
				render: () => instance.getVNode(),
			});

			expect(DEither.isLeft(await instance.check())).toBe(true);
			expect(wrapper.find("#input-error-message").text()).toBe("Error");
		});
	});

	describe("rendering", () => {
		it("renders label, class and synchronized current value", async() => {
			const templateSpy = vi.spyOn(testTemplates.input, "getVNode");
			const useInput = createInput(TextInput, {
				defaultValue: "default",
			});
			const modelValue = ref("default");
			const instance = useInput({
				class: "input-template-class",
				label: "Label",
				props: () => ({
					class: "input-component-class",
				}),
			}).new(
				modelValue,
				"FIELD",
				{
					templates: testTemplates,
					getSlot: () => null,
					errorInterpreter: DDataStructure.createErrorInterpreter(),
					codecs: undefined,
				},
			);
			const wrapper = mount({
				render: () => instance.getVNode(),
			});

			expect(wrapper.find("#test-text-input").attributes("id")).toBe("test-text-input");
			expect(wrapper.find("#test-text-input").classes()).toContain("input-component-class");
			expect(wrapper.find("#current-value-input").text()).toBe("default");
			expect(wrapper.find(".input-template-class").exists()).toBe(true);
			expect(templateSpy.mock.calls[0]?.[0].getLabel?.()).toBe("Label");

			await wrapper.find("#test-text-input").setValue("updated");

			expect(modelValue.value).toBe("updated");
			expect(wrapper.find("#current-value-input").text()).toBe("updated");
		});

		it("uses a local input template instead of the context template", () => {
			const localTemplate = createTemplate("input", InputTemplate)();
			const localTemplateSpy = vi.spyOn(localTemplate, "getVNode");
			const contextTemplateSpy = vi.spyOn(testTemplates.input, "getVNode");
			const useInput = createInput(TextInput, {
				defaultValue: "default",
			});
			const instance = useInput({
				template: localTemplate,
			}).new(
				ref("default"),
				"FIELD",
				{
					templates: testTemplates,
					getSlot: () => null,
					errorInterpreter: DDataStructure.createErrorInterpreter(),
					codecs: undefined,
				},
			);

			mount({
				render: () => instance.getVNode(),
			});

			expect(localTemplateSpy).toHaveBeenCalledTimes(1);
			expect(contextTemplateSpy).not.toHaveBeenCalled();
		});
	});
});

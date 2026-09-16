import * as DEither from "@duplojs/lang/either";
import { ref } from "vue";
import { createFormField, formFieldKind } from "@V/formField";
import { testTemplates } from "@test-utils/vue/templates";

describe("formField", () => {
	it("creates a form field kind with its default value", () => {
		const field = createFormField(
			(modelValue) => ({
				check: () => Promise.resolve(DEither.success(modelValue.value)),
				reset: () => undefined,
				dispose: () => undefined,
				getVNode: () => null,
			}),
			"default",
		);

		expect(formFieldKind.has(field)).toBe(true);
		expect(field.defaultValue).toBe("default");
	});

	it("keeps the field factory callable with model, parent key and context", async() => {
		const modelValue = ref("value");
		const getSlot = vi.fn(() => null);
		const field = createFormField(
			(receivedModelValue, parentKey, context) => ({
				check: () => Promise.resolve(DEither.success({
					modelValue: receivedModelValue.value,
					parentKey,
					slot: context.getSlot("default", {
						fieldKey: "field",
						value: receivedModelValue.value,
						update: (value) => {
							receivedModelValue.value = value;
						},
					}),
					hasTemplates: context.templates === testTemplates,
				})),
				reset: () => {
					receivedModelValue.value = "reset";
				},
				dispose: () => {
					receivedModelValue.value = "disposed";
				},
				getVNode: () => null,
			}),
			"default",
		);
		const instance = field.new(
			modelValue,
			"parent",
			{
				templates: testTemplates,
				getSlot,
				errorInterpreter: vi.fn(),
				codecs: undefined,
			},
		);

		await expect(instance.check()).resolves.toStrictEqual(
			DEither.success({
				modelValue: "value",
				parentKey: "parent",
				slot: null,
				hasTemplates: true,
			}),
		);
		expect(getSlot).toHaveBeenCalledWith(
			"default",
			expect.objectContaining({
				fieldKey: "field",
				value: "value",
			}),
		);

		instance.reset();
		expect(modelValue.value).toBe("reset");

		instance.dispose();
		expect(modelValue.value).toBe("disposed");
	});
});

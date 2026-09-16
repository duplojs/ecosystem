import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { type Ref } from "vue";
import { createForm, createTemplate } from "@V";
import { createFormField, type DetailsError } from "@V/formField";
import { useUnionLayout } from "@V/layouts";
import { createTestFormField } from "@test-utils/vue/formField";
import UnionTemplateAlt from "@test-utils/vue/templates/UnionTemplateAlt.vue";
import { testTemplates } from "@test-utils/vue/templates";

describe("useUnionLayout", () => {
	describe("logic", () => {
		it("checks the current kind and returns it with the checked value", async() => {
			const { check } = createForm(testTemplates)(
				useUnionLayout(
					[
						[
							"text",
							createTestFormField("text-default", {
								check: () => Promise.resolve(DEither.success("checked-text")),
							}),
						],
						["number", createTestFormField("number-default")],
					],
					{
						defaultKind: "text",
					},
				),
			);

			await expect(check()).resolves.toStrictEqual(
				DEither.success({
					kind: "text",
					value: "checked-text",
				}),
			);
		});

		it("keeps the default updateKind as a no-op before instantiation", () => {
			const field = useUnionLayout(
				[
					["text", createTestFormField("text-default")],
					["number", createTestFormField("number-default")],
				],
				{
					defaultKind: "text",
				},
			);

			field.defaultValue.updateKind("number");

			expect(field.defaultValue).toEqual(
				expect.objectContaining({
					kind: "text",
					value: "text-default",
				}),
			);
		});

		it("caches values when switching kind", () => {
			const { component, currentValue } = createForm(testTemplates)(
				useUnionLayout(
					[
						["text", createTestFormField("text-default")],
						["number", createTestFormField("number-default")],
					],
					{
						defaultKind: "text",
					},
				),
			);

			mount(component);

			currentValue.value.value = "text-current";
			currentValue.value.updateKind("number");
			currentValue.value.value = "number-current";
			currentValue.value.updateKind("text");

			expect(currentValue.value).toEqual(
				expect.objectContaining({
					kind: "text",
					value: "text-current",
				}),
			);
		});

		it("uses an explicit value when switching kind", () => {
			const { component, currentValue } = createForm(testTemplates)(
				useUnionLayout(
					[
						["text", createTestFormField("text-default")],
						["number", createTestFormField("number-default")],
					],
					{
						defaultKind: "text",
					},
				),
			);

			mount(component);

			currentValue.value.updateKind("number", "explicit-value");

			expect(currentValue.value).toEqual(
				expect.objectContaining({
					kind: "number",
					value: "explicit-value",
				}),
			);
		});

		it("returns current field errors", async() => {
			const { check } = createForm(testTemplates)(
				useUnionLayout(
					[
						[
							"text",
							createTestFormField("text-default", {
								check: (_value, key) => Promise.resolve(
									DEither.error<DetailsError>(DCommon.cast([{ key }])),
								),
							}),
						],
						["number", createTestFormField("number-default")],
					],
					{
						defaultKind: "text",
					},
				),
			);

			await expect(check()).resolves.toStrictEqual(
				DEither.error([{ key: "FRM_UNI-text" }]),
			);
		});

		it("delegates reset and dispose to cached fields", async() => {
			const reset = vi.fn();
			const dispose = vi.fn();
			const {
				component,
				currentValue,
				check,
				reset: resetForm,
				dispose: disposeForm,
			} = createForm(testTemplates)(
				useUnionLayout(
					[
						[
							"text",
							createTestFormField("text-default", {
								onReset: reset,
								onDispose: dispose,
							}),
						],
						[
							"number",
							createTestFormField("number-default", {
								onReset: reset,
								onDispose: dispose,
							}),
						],
					],
					{
						defaultKind: "text",
					},
				),
			);

			mount(component);
			currentValue.value.updateKind("number");
			await check();

			resetForm();
			disposeForm();

			expect(reset).toHaveBeenCalledTimes(2);
			expect(dispose).toHaveBeenCalledTimes(2);
		});

		it("ignores writes from inactive cached fields", async() => {
			const refs: Record<string, Ref<string>> = {};
			const createCapturedField = (defaultValue: string) => createFormField(
				(modelValue, parentKey) => {
					refs[parentKey] = modelValue as Ref<string>;

					return {
						check: () => Promise.resolve(DEither.success(modelValue.value)),
						reset: () => undefined,
						dispose: () => undefined,
						getVNode: () => null,
					};
				},
				defaultValue,
			);
			const { component, currentValue, check } = createForm(testTemplates)(
				useUnionLayout(
					[
						["text", createCapturedField("text-default")],
						["number", createCapturedField("number-default")],
					],
					{
						defaultKind: "text",
					},
				),
			);

			mount(component);
			currentValue.value.updateKind("number");
			await check();

			expect(refs["FRM_UNI-text"]!.value).toBe("text-default");

			refs["FRM_UNI-text"]!.value = "ignored";
			refs["FRM_UNI-number"]!.value = "active";

			expect(currentValue.value).toEqual(
				expect.objectContaining({
					kind: "number",
					value: "active",
				}),
			);
		});
	});

	describe("rendering", () => {
		it("renders available kinds and swaps the active field on selection", async() => {
			const { component, currentValue } = createForm(testTemplates)(
				useUnionLayout(
					[
						["text", createTestFormField("text-default")],
						["other", createTestFormField("other-default")],
					],
					{
						defaultKind: "text",
					},
				),
			);
			const wrapper = mount(component);

			expect(wrapper.find("#union-field-key").text()).toBe("FRM_UNI");
			expect(wrapper.find("#union-current-kind").text()).toBe("text");
			expect(wrapper.find("#field-FRM_UNI-text").text()).toBe("text-default");

			await wrapper.find("#union-kind-select").setValue("other");

			expect(currentValue.value).toEqual(
				expect.objectContaining({
					kind: "other",
					value: "other-default",
				}),
			);
			expect(wrapper.find("#field-FRM_UNI-other").text()).toBe("other-default");
		});

		it("ignores unknown kind selections", async() => {
			const { component, currentValue } = createForm(testTemplates)(
				useUnionLayout(
					[
						["a", createTestFormField("a-default")],
						["b", createTestFormField("b-default")],
					],
					{
						defaultKind: "a",
						template: createTemplate("union", UnionTemplateAlt)(),
					},
				),
			);
			const wrapper = mount(component);

			await wrapper.find("#local-union-invalid-kind").trigger("click");

			expect(currentValue.value.kind).toBe("a");

			await wrapper.find("#local-union-kind-b").trigger("click");

			expect(currentValue.value.kind).toBe("b");
		});
	});
});

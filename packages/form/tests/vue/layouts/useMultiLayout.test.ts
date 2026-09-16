import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { createForm, createInput } from "@V";
import type { DetailsError } from "@V/formField";
import { useMultiLayout } from "@V/layouts";
import { createTestFormField } from "@test-utils/vue/formField";
import TextInput from "@test-utils/vue/TextInput.vue";
import { testTemplates } from "@test-utils/vue/templates";

describe("useMultiLayout", () => {
	describe("logic", () => {
		it("aggregates checked values and errors from child fields", async() => {
			const { check } = createForm(testTemplates)(
				useMultiLayout({
					first: createTestFormField("one", {
						check: () => Promise.resolve(DEither.success("checked-one")),
					}),
					second: createTestFormField("two", {
						check: (_value, key) => Promise.resolve(
							DEither.error<DetailsError>(DCommon.cast([{ key }])),
						),
					}),
				}),
			);

			await expect(check()).resolves.toStrictEqual(
				DEither.error([{ key: "FRM_MUL-second" }]),
			);
		});

		it("returns checked values when every child succeeds", async() => {
			const { check } = createForm(testTemplates)(
				useMultiLayout([
					[
						"first",
						createTestFormField("one", {
							check: () => Promise.resolve(DEither.success("checked-one")),
						}),
					],
					[
						"second",
						createTestFormField("two", {
							check: () => Promise.resolve(DEither.success("checked-two")),
						}),
					],
				]),
			);

			await expect(check()).resolves.toStrictEqual(
				DEither.success({
					first: "checked-one",
					second: "checked-two",
				}),
			);
		});

		it("resets and disposes every child field", () => {
			const reset = vi.fn();
			const dispose = vi.fn();
			const { reset: resetForm, dispose: disposeForm } = createForm(testTemplates)(
				useMultiLayout({
					first: createTestFormField("one", {
						onReset: reset,
						onDispose: dispose,
					}),
					second: createTestFormField("two", {
						onReset: reset,
						onDispose: dispose,
					}),
				}),
			);

			resetForm();
			disposeForm();

			expect(reset).toHaveBeenCalledTimes(2);
			expect(dispose).toHaveBeenCalledTimes(2);
		});
	});

	describe("rendering", () => {
		it("renders all child fields and keeps object values synchronized", async() => {
			const useInput = createInput(TextInput, {
				defaultValue: "one",
			});
			const { component, currentValue } = createForm(testTemplates)(
				useMultiLayout({
					first: useInput(),
					second: createTestFormField("two"),
				}),
			);
			const wrapper = mount(component);

			expect(wrapper.find("#multi-field-key").text()).toBe("FRM_MUL");
			expect(wrapper.find("#multi-form-fields-count").text()).toBe("2");
			expect(wrapper.find("#field-FRM_MUL-second").text()).toBe("two");

			await wrapper.find("#test-text-input").setValue("updated");

			expect(currentValue.value.first).toBe("updated");
			expect(wrapper.find("#multi-current-value").text()).toBe(JSON.stringify(currentValue.value));
		});
	});
});

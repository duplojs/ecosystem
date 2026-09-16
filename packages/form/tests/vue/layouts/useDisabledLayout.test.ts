import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import { createForm } from "@V";
import { useDisabledLayout } from "@V/layouts";
import { createTestFormField } from "@test-utils/vue/formField";
import { testTemplates } from "@test-utils/vue/templates";

describe("useDisabledLayout", () => {
	describe("logic", () => {
		it("returns undefined and skips the wrapped check when disabled", async() => {
			const check = vi.fn(() => Promise.resolve(DEither.success("checked")));
			const { check: checkForm } = createForm(testTemplates)(
				useDisabledLayout(
					createTestFormField("default", { check }),
					{
						isDisabled: () => true,
					},
				),
			);

			await expect(checkForm()).resolves.toStrictEqual(
				DEither.success(undefined),
			);
			expect(check).not.toHaveBeenCalled();
		});

		it("delegates check reset and dispose when enabled", async() => {
			const reset = vi.fn();
			const dispose = vi.fn();
			const check = vi.fn(() => Promise.resolve(DEither.success("checked")));
			const { check: checkForm, reset: resetForm, dispose: disposeForm } = createForm(testTemplates)(
				useDisabledLayout(
					createTestFormField("default", {
						check,
						onReset: reset,
						onDispose: dispose,
					}),
					{
						isDisabled: () => false,
					},
				),
			);

			await expect(checkForm()).resolves.toStrictEqual(
				DEither.success("checked"),
			);

			resetForm();
			disposeForm();

			expect(check).toHaveBeenCalledTimes(1);
			expect(reset).toHaveBeenCalledTimes(1);
			expect(dispose).toHaveBeenCalledTimes(1);
		});
	});

	describe("rendering", () => {
		it("hides the wrapped field while disabled and renders it when enabled", async() => {
			const isDisabled = ref(true);
			const { component } = createForm(testTemplates)(
				useDisabledLayout(
					createTestFormField("default"),
					{
						isDisabled: () => isDisabled.value,
					},
				),
			);
			const wrapper = mount(component);

			expect(wrapper.find("#field-FRM_DIS").exists()).toBe(false);

			isDisabled.value = false;
			await nextTick();

			expect(wrapper.find("#field-FRM_DIS").text()).toBe("default");
		});
	});
});

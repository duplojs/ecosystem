import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { h } from "vue";
import { createForm } from "@V";
import type { FormFieldSlotParams } from "@V/formField";
import { useSlotLayout } from "@V/layouts";
import { createTestFormField } from "@test-utils/vue/formField";
import { testTemplates } from "@test-utils/vue/templates";

describe("useSlotLayout", () => {
	describe("logic", () => {
		it("creates a primitive slot field from a default value factory", async() => {
			const defaultValue = {
				value: "default",
			};
			const field = useSlotLayout(
				"custom",
				{
					defaultValue: () => defaultValue,
				},
			);
			const { currentValue, check } = createForm(testTemplates)(field);

			await expect(check()).resolves.toStrictEqual(
				DEither.success(defaultValue),
			);
			expect(field.defaultValue).toBe(defaultValue);
			expect(currentValue.value).toStrictEqual(defaultValue);
		});

		it("keeps primitive slot reset and dispose as no-op operations", () => {
			const { currentValue, reset, dispose } = createForm(testTemplates)(
				useSlotLayout(
					"custom",
					{
						defaultValue: "default",
					},
				),
			);

			currentValue.value = "updated";
			reset();
			dispose();

			expect(currentValue.value).toBe("default");
		});

		it("delegates checks to wrapped fields", async() => {
			const { check } = createForm(testTemplates)(
				useSlotLayout(
					"custom",
					createTestFormField("default", {
						check: () => Promise.resolve(DEither.success("checked")),
					}),
				),
			);

			await expect(check()).resolves.toStrictEqual(
				DEither.success("checked"),
			);
		});
	});

	describe("rendering", () => {
		it("renders the named slot with update params", async() => {
			const { component, currentValue } = createForm(testTemplates)(
				useSlotLayout(
					"custom",
					{
						defaultValue: "default",
					},
				),
			);
			const wrapper = mount(component, {
				slots: {
					custom: (params) => h(
						"button",
						{
							id: "slot-action",
							type: "button",
							onClick: () => params.update("updated"),
						},
						`${params.fieldKey}:${params.value}`,
					),
				},
			});

			expect(wrapper.find("#slot-action").text()).toBe("FRM_SLT:default");

			await wrapper.find("#slot-action").trigger("click");

			expect(currentValue.value).toBe("updated");
			expect(wrapper.find("#slot-action").text()).toBe("FRM_SLT:updated");
		});

		it("passes the wrapped field vnode to the named slot", () => {
			const reset = vi.fn();
			const dispose = vi.fn();
			const { component, reset: resetForm, dispose: disposeForm } = createForm(testTemplates)(
				useSlotLayout(
					"custom",
					createTestFormField("default", {
						onReset: reset,
						onDispose: dispose,
					}),
				),
			);
			const wrapper = mount(component, {
				slots: {
					custom: (params: FormFieldSlotParams<unknown>) => h("div", { id: "slot-wrapper" }, [
						h("span", { id: "slot-value" }, params.value as string),
						params.formField?.(),
					]),
				},
			});

			expect(wrapper.find("#slot-value").text()).toBe("default");
			expect(wrapper.find("#field-FRM_SLT").text()).toBe("default");

			resetForm();
			disposeForm();

			expect(reset).toHaveBeenCalledTimes(1);
			expect(dispose).toHaveBeenCalledTimes(1);
		});

		it("updates wrapped field values through the named slot", async() => {
			const { component, currentValue, reset, dispose } = createForm(testTemplates)(
				useSlotLayout(
					"custom",
					createTestFormField("default"),
				),
			);
			const wrapper = mount(component, {
				slots: {
					custom: (params: FormFieldSlotParams<unknown>) => h("button", {
						id: "slot-update",
						type: "button",
						onClick: () => params.update("updated"),
					}),
				},
			});

			await wrapper.find("#slot-update").trigger("click");

			expect(currentValue.value).toBe("updated");

			reset();
			dispose();
		});
	});
});

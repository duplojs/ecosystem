import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { createForm, createInput, createTemplate } from "@V";
import type { DetailsError } from "@V/formField";
import { useStepLayout } from "@V/layouts";
import { createTestFormField } from "@test-utils/vue/formField";
import TextInput from "@test-utils/vue/TextInput.vue";
import StepTemplateAlt from "@test-utils/vue/templates/StepTemplateAlt.vue";
import { testTemplates } from "@test-utils/vue/templates";

describe("useStepLayout", () => {
	describe("logic", () => {
		it("blocks check before the last step and exposes the configured error", async() => {
			const { component, check } = createForm(testTemplates)(
				useStepLayout(
					[
						createTestFormField("one"),
						createTestFormField("two"),
					],
					{
						errorMessageNotAtLastStep: "Go to last step",
					},
				),
			);
			const wrapper = mount(component);

			await expect(check()).resolves.toStrictEqual(
				DEither.error([{ key: "FRM_STP" }]),
			);
			expect(wrapper.find("#step-error-message").text()).toBe("Go to last step");
		});

		it("moves to the first invalid step when final check fails", async() => {
			const { currentValue, check } = createForm(testTemplates)(
				useStepLayout(
					[
						createTestFormField("one"),
						createTestFormField("two", {
							check: (_value, key) => Promise.resolve(
								DEither.error<DetailsError>(DCommon.cast([{ key }])),
							),
						}),
					],
					{
						errorMessageNotAtLastStep: "Go to last step",
					},
				),
			);

			currentValue.value.currentStep = 1;

			await expect(check()).resolves.toStrictEqual(
				DEither.error([{ key: "FRM_STP-1" }]),
			);
			expect(currentValue.value.currentStep).toBe(1);
		});

		it("keeps the first invalid step when several final checks fail", async() => {
			const { currentValue, check } = createForm(testTemplates)(
				useStepLayout(
					[
						createTestFormField("one", {
							check: (_value, key) => Promise.resolve(
								DEither.error<DetailsError>(DCommon.cast([{ key }])),
							),
						}),
						createTestFormField("two", {
							check: (_value, key) => Promise.resolve(
								DEither.error<DetailsError>(DCommon.cast([{ key }])),
							),
						}),
					],
					{
						errorMessageNotAtLastStep: "Go to last step",
					},
				),
			);

			currentValue.value.currentStep = 1;

			await expect(check()).resolves.toStrictEqual(
				DEither.error([
					{ key: "FRM_STP-0" },
					{ key: "FRM_STP-1" },
				]),
			);
			expect(currentValue.value.currentStep).toBe(0);
		});

		it("keeps the current step when next step validation fails asynchronously", async() => {
			const { component, currentValue } = createForm(testTemplates)(
				useStepLayout(
					[
						createTestFormField("one", {
							check: (_value, key) => Promise.resolve(
								DEither.error<DetailsError>(DCommon.cast([{ key }])),
							),
						}),
						createTestFormField("two"),
					],
					{
						errorMessageNotAtLastStep: "Go to last step",
					},
				),
			);
			const wrapper = mount(component);

			await wrapper.find("#step-next").trigger("click");

			expect(currentValue.value.currentStep).toBe(0);
		});

		it("checks every step successfully on the last step", async() => {
			const { currentValue, check } = createForm(testTemplates)(
				useStepLayout(
					[
						createTestFormField("one", {
							check: () => Promise.resolve(DEither.success("checked-one")),
						}),
						createTestFormField("two", {
							check: () => Promise.resolve(DEither.success("checked-two")),
						}),
					],
					{
						errorMessageNotAtLastStep: "Go to last step",
					},
				),
			);

			currentValue.value.currentStep = 1;

			await expect(check()).resolves.toStrictEqual(
				DEither.success(["checked-one", "checked-two"]),
			);
		});

		it("delegates reset and dispose to cached steps", async() => {
			const reset = vi.fn();
			const dispose = vi.fn();
			const {
				component,
				currentValue,
				check,
				reset: resetForm,
				dispose: disposeForm,
			} = createForm(testTemplates)(
				useStepLayout(
					[
						createTestFormField("one", {
							onReset: reset,
							onDispose: dispose,
						}),
						createTestFormField("two", {
							onReset: reset,
							onDispose: dispose,
						}),
					],
					{
						errorMessageNotAtLastStep: "Go to last step",
					},
				),
			);

			mount(component);
			currentValue.value.currentStep = 1;
			await check();

			resetForm();
			disposeForm();

			expect(reset).toHaveBeenCalledTimes(2);
			expect(dispose).toHaveBeenCalledTimes(2);
		});
	});

	describe("rendering", () => {
		it("navigates, resets the current step and renders the active field", async() => {
			const useInput = createInput(TextInput, {
				defaultValue: "one",
			});
			const { component, currentValue } = createForm(testTemplates)(
				useStepLayout(
					[
						useInput(),
						createTestFormField("two"),
					],
					{
						errorMessageNotAtLastStep: "Go to last step",
					},
				),
			);
			const wrapper = mount(component);

			expect(wrapper.find("#step-current").text()).toBe("0/2");
			expect(wrapper.find("#test-text-input").exists()).toBe(true);

			await wrapper.find("#test-text-input").setValue("updated");
			await wrapper.find("#step-next").trigger("click");
			await DCommon.timeout();

			expect(currentValue.value.currentStep).toBe(1);
			expect(wrapper.find("#field-FRM_STP-1").text()).toBe("two");
			expect(wrapper.find("#step-is-last").text()).toBe("true");

			await wrapper.find("#step-previous").trigger("click");
			await wrapper.find("#step-reset").trigger("click");

			expect(currentValue.value.steps[0]).toBe("one");
		});

		it("keeps the current step when navigation would leave the range", async() => {
			const { component, currentValue } = createForm(testTemplates)(
				useStepLayout(
					[
						createTestFormField("one"),
						createTestFormField("two"),
					],
					{
						errorMessageNotAtLastStep: "Go to last step",
					},
				),
			);
			const wrapper = mount(component);

			await wrapper.find("#step-previous").trigger("click");

			expect(currentValue.value.currentStep).toBe(0);

			currentValue.value.currentStep = 1;
			await wrapper.find("#step-next").trigger("click");
			await DCommon.timeout();

			expect(currentValue.value.currentStep).toBe(1);
		});

		it("exposes every step vnode getter to templates", () => {
			const localTemplate = createTemplate("step", StepTemplateAlt)();
			const templateSpy = vi.spyOn(localTemplate, "getVNode");
			const { component } = createForm(testTemplates)(
				useStepLayout(
					[
						createTestFormField("one"),
						createTestFormField("two"),
					],
					{
						errorMessageNotAtLastStep: "Go to last step",
						template: localTemplate,
					},
				),
			);

			mount(component);

			expect(templateSpy.mock.calls[0]?.[0].getFormFields()[0]?.()).not.toBeNull();
		});
	});
});

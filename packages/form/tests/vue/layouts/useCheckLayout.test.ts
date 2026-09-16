import * as DCommon from "@duplojs/lang/common";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import { createForm, createInput, createTemplate } from "@V";
import type { DetailsError } from "@V/formField";
import { useCheckLayout } from "@V/layouts";
import { createFormFieldContext, createTestFormField } from "@test-utils/vue/formField";
import TextInput from "@test-utils/vue/TextInput.vue";
import CheckTemplate from "@test-utils/vue/templates/CheckTemplate.vue";
import { testTemplates } from "@test-utils/vue/templates";

describe("useCheckLayout", () => {
	describe("logic", () => {
		it("checks the wrapped field before refine and exposes refine errors", async() => {
			const refine = vi.fn((value: unknown) => (
				value === "checked"
					? DEither.error("Refine error")
					: DEither.ok()
			));
			const field = createTestFormField(
				"default",
				{
					check: () => Promise.resolve(DEither.success("checked")),
				},
			);
			const { check } = createForm(testTemplates)(
				useCheckLayout(field, { refine }),
			);

			await expect(check()).resolves.toStrictEqual(
				DEither.error([{ key: "FRM_CHK" }]),
			);
			expect(refine).toHaveBeenCalledWith("checked");
		});

		it("parses checked values with form codecs and renders interpreted errors", async() => {
			const useInput = createInput(TextInput, {
				defaultValue: "42",
			});
			const { component, check } = createForm(testTemplates)(
				useCheckLayout(
					useInput(),
					{
						dataStructure: DDataStructure.number(),
					},
				),
				{
					codecs: DDataStructure.codecsString,
					errorInterpreter: () => [
						{
							interpretedMessage: {
								interpretedSubSource: "Codec says no",
							},
						},
					] as never,
				},
			);
			const wrapper = mount(component);

			await wrapper.find("#test-text-input").setValue("not-a-number");

			expect(DEither.isLeft(await check())).toBe(true);
			expect(wrapper.find("#check-error-message").text()).toBe("Codec says no");

			await wrapper.find("#test-text-input").setValue("42");

			await expect(check()).resolves.toStrictEqual(
				DEither.success(42),
			);
			expect(wrapper.find("#check-error-message").text()).toBe("");
		});

		it("returns checked values without data structure parsing", async() => {
			const { check } = createForm(testTemplates)(
				useCheckLayout(
					createTestFormField("default", {
						check: () => Promise.resolve(DEither.success("checked")),
					}),
					{},
				),
			);

			await expect(check()).resolves.toStrictEqual(
				DEither.success("checked"),
			);
		});

		it.each([
			[
				"interpreted source",
				{
					interpretedSource: "Interpreted source",
				},
				"Interpreted source",
			],
			[
				"sub source",
				{
					subSource: "Sub source",
				},
				"Sub source",
			],
			[
				"source",
				{
					source: "Source",
				},
				"Source",
			],
			[
				"unknown error fallback",
				{},
				"Unknown Error",
			],
		])("renders %s data structure message", async(_name, interpretedMessage, expectedMessage) => {
			const { component, check } = createForm(testTemplates)(
				useCheckLayout(
					createTestFormField("default"),
					{
						dataStructure: {
							asyncParse: () => Promise.resolve(
								DEither.error({} as DDataStructure.Error),
							),
						} as unknown as DDataStructure.Structure,
					},
				),
				{
					errorInterpreter: () => [
						{
							interpretedMessage,
						},
					] as never,
				},
			);
			const wrapper = mount(component);

			expect(DEither.isLeft(await check())).toBe(true);
			expect(wrapper.find("#check-error-message").text()).toBe(expectedMessage);
		});

		it("resets the wrapped field and clears displayed errors", async() => {
			const field = createTestFormField(
				"default",
				{
					onReset: (modelValue) => {
						modelValue.value = "reset";
					},
				},
			);
			const { component, check, reset } = createForm(testTemplates)(
				useCheckLayout(field, {
					refine: () => DEither.error("Refine error"),
				}),
			);
			const wrapper = mount(component);

			expect(DEither.isLeft(await check())).toBe(true);
			expect(wrapper.find("#check-error-message").text()).toBe("Refine error");

			reset();
			await nextTick();

			expect(wrapper.find("#check-current-value").text()).toBe("default");
			expect(wrapper.find("#check-error-message").text()).toBe("");
		});

		it("returns wrapped field errors and disposes the wrapped field", async() => {
			const dispose = vi.fn();
			const { check, dispose: disposeForm } = createForm(testTemplates)(
				useCheckLayout(
					createTestFormField("default", {
						check: () => Promise.resolve(
							DEither.error<DetailsError>(DCommon.cast([{ key: "inner" }])),
						),
						onDispose: dispose,
					}),
					{},
				),
			);

			await expect(check()).resolves.toStrictEqual(
				DEither.error([{ key: "inner" }]),
			);

			disposeForm();

			expect(dispose).toHaveBeenCalledTimes(1);
		});
	});

	describe("rendering", () => {
		it("renders the check template with the wrapped field, current value and class", () => {
			const localTemplate = createTemplate("check", CheckTemplate)();
			const localTemplateSpy = vi.spyOn(localTemplate, "getVNode");
			const field = createTestFormField("default");
			const instance = useCheckLayout(field, {
				class: "check-class",
				template: localTemplate,
			}).new(
				ref("value"),
				"FIELD",
				createFormFieldContext(),
			);
			const wrapper = mount({
				render: () => instance.getVNode(),
			});

			expect(wrapper.find("#check-field-key").text()).toBe("FIELD_CHK");
			expect(wrapper.find("#field-FIELD_CHK").text()).toBe("value");
			expect(wrapper.find("#check-current-value").text()).toBe("value");
			expect(wrapper.find(".check-class").exists()).toBe(true);
			expect(localTemplateSpy).toHaveBeenCalledTimes(1);
		});
	});
});

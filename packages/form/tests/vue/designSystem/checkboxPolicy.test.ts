import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { page } from "vitest/browser";
import { defineComponent, h, nextTick, ref } from "vue";
import { createForm, useMultiLayout, useSectionLayout, type FormField } from "@V";
import { CheckboxPolicy, PrimaryButton, templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useCheckboxPolicy, useTextInput } from "@V/designSystem";
import { createGridTemplates } from "@V/templates/grid";

describe("designSystem/CheckboxPolicy", () => {
	const mountedWrappers: ReturnType<typeof mount>[] = [];

	afterEach(() => {
		mountedWrappers.forEach(
			(wrapper) => void wrapper.unmount(),
		);
		mountedWrappers.length = 0;
		document.body.innerHTML = "";
	});

	const gridTemplates = createGridTemplates({
		repeat: {
			addButton: templateFormAddButton,
			addLabel: "Add policy",
			removeButton: templateFormRemoveButton,
			removeLabel: "Remove policy",
			resetButton: templateFormResetButton,
			resetLabel: "Reset policy",
		},
		step: {
			nextButton: templateFormNextButton,
			nextLabel: "Next",
			previousButton: templateFormPreviousButton,
			previousLabel: "Previous",
			resetButton: templateFormResetButton,
		},
		union: {
			selectInputKind: templateFormSelect,
		},
	});

	function mountForm(formField: FormField) {
		const useForm = createForm(gridTemplates.useTemplates());
		const form = useForm(formField);
		const checkResult = ref("not checked");
		const Harness = defineComponent({
			setup() {
				async function submit() {
					const result = await form.check();

					checkResult.value = DEither.isRight(result)
						? `success:${JSON.stringify(DEither.unwrapRight(result))}`
						: "error";
				}

				return () => h(
					"section",
					[
						h(
							form.component,
							{ onSubmit: submit },
							{
								default: () => h(
									PrimaryButton,
									{
										label: "Submit",
										type: "submit",
									},
								),
							},
						),
						h(
							"output",
							{ "data-testid": "current-value" },
							JSON.stringify(form.currentValue.value),
						),
						h(
							"output",
							{ "data-testid": "check-result" },
							checkResult.value,
						),
					],
				);
			},
		});

		const wrapper = mount(Harness, {
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		return wrapper;
	}

	it("renders policy content and synchronizes acceptance inside a real form", async() => {
		mountForm(
			useSectionLayout(
				useMultiLayout({
					email: useTextInput({
						label: "Email",
						defaultValue: "client@duplo.test",
					}),
					terms: useCheckboxPolicy({
						props: {
							title: "Accept the service terms",
							description: "Required before creating the workspace.",
							name: "service-terms",
							required: true,
							errorMessage: "You must accept the service terms.",
						},
					}),
				}),
				{ title: "Workspace access" },
			),
		);

		const termsCheckbox = page.getByRole("checkbox", { name: /Accept the service terms/ });

		await expect.element(page.getByText("Required before creating the workspace.")).toBeInTheDocument();
		await expect.element(page.getByText("*")).toBeInTheDocument();
		await expect.element(termsCheckbox).not.toBeChecked();
		await expect.element(termsCheckbox).toHaveAttribute("name", "service-terms");

		await termsCheckbox.click();

		await expect.element(termsCheckbox).toBeChecked();
		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"email\":\"client@duplo.test\",\"terms\":true}");
	});

	it("blocks submit while required policy is not accepted and succeeds after acceptance", async() => {
		mountForm(
			useCheckboxPolicy({
				props: {
					title: "Accept the privacy policy",
					description: "We need this consent to continue.",
					name: "privacy-policy",
					required: true,
					errorMessage: "Please accept the privacy policy.",
				},
			}),
		);

		const policyCheckbox = page.getByRole("checkbox", { name: /Accept the privacy policy/ });

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByText("Please accept the privacy policy.")).toBeInTheDocument();
		await expect.element(page.getByTestId("check-result")).toHaveTextContent("error");

		await policyCheckbox.click();
		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByText("Please accept the privacy policy.")).not.toBeInTheDocument();
		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:true");
	});

	it("allows submit without acceptance when the policy is optional", async() => {
		mountForm(
			useCheckboxPolicy({
				props: {
					title: "Receive partner offers",
					description: "Optional account updates.",
					name: "partner-offers",
				},
			}),
		);

		const policyCheckbox = page.getByRole("checkbox", { name: "Receive partner offers" });

		await expect.element(policyCheckbox).not.toBeChecked();
		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByText("Required")).not.toBeInTheDocument();
		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:false");
	});

	it("renders the CheckboxPolicy component markup without optional description", () => {
		const wrapper = mount(CheckboxPolicy, {
			props: {
				id: "standalone-policy",
				modelValue: false,
				name: "standalone-policy",
				title: "Standalone policy",
				"onUpdate:modelValue": () => {},
			},
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		const input = wrapper.get("input");

		expect(wrapper.classes()).toContain("DFV-checkbox-policy");
		expect(input.classes()).toContain("DFV-checkbox-input");
		expect(input.attributes("id")).toBe("standalone-policy");
		expect(input.attributes("name")).toBe("standalone-policy");
		expect(wrapper.find(".DFV-checkbox-policy-description").exists()).toBe(false);
		expect(wrapper.find(".DFV-checkbox-policy-required").exists()).toBe(false);
	});

	it("clears its exposed validation error when reset is called", async() => {
		const wrapper = mount(CheckboxPolicy, {
			props: {
				id: "reset-policy",
				errorMessage: "Reset this policy error.",
				modelValue: false,
				required: true,
				title: "Reset policy",
				"onUpdate:modelValue": () => {},
			},
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		const exposed = wrapper.vm as unknown as {
			check(): unknown;
			reset(): void;
		};

		await exposed.check();
		await nextTick();

		expect(wrapper.text()).toContain("Reset this policy error.");

		exposed.reset();
		await nextTick();

		expect(wrapper.text()).not.toContain("Reset this policy error.");
	});
});

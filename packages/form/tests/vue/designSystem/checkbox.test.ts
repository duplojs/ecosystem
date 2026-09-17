import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { page } from "vitest/browser";
import { defineComponent, h, ref } from "vue";
import { createForm, useCheckLayout, useMultiLayout, useSectionLayout, type FormField } from "@V";
import { PrimaryButton, TheCheckbox, templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useCheckbox, useTextInput } from "@V/designSystem";
import { createGridTemplates } from "@V/templates/grid";

describe("designSystem/TheCheckbox", () => {
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
			addLabel: "Add checkbox",
			removeButton: templateFormRemoveButton,
			removeLabel: "Remove checkbox",
			resetButton: templateFormResetButton,
			resetLabel: "Reset checkbox",
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

	it("renders unchecked by default and synchronizes its value inside a real form", async() => {
		mountForm(
			useSectionLayout(
				useMultiLayout({
					email: useTextInput({
						label: "Email",
						defaultValue: "team@duplo.test",
					}),
					newsletter: useCheckbox({
						label: "Receive product updates",
						props: {
							name: "newsletter",
						},
					}),
				}),
				{ title: "Preferences" },
			),
		);

		const newsletterCheckbox = page.getByRole("checkbox", { name: "Receive product updates" });

		await expect.element(newsletterCheckbox).not.toBeChecked();
		await expect.element(newsletterCheckbox).toHaveAttribute("name", "newsletter");
		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"email\":\"team@duplo.test\",\"newsletter\":false}");

		await newsletterCheckbox.click();

		await expect.element(newsletterCheckbox).toBeChecked();
		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"email\":\"team@duplo.test\",\"newsletter\":true}");

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:{\"email\":\"team@duplo.test\",\"newsletter\":true}");
	});

	it("displays validation feedback until the checkbox is checked", async() => {
		mountForm(
			useCheckLayout(
				useCheckbox({
					label: "Accept marketing consent",
					dataStructure: DDataStructure.literal(true),
					props: {
						name: "marketing-consent",
					},
				}),
				{},
			),
		);

		const consentCheckbox = page.getByRole("checkbox", { name: "Accept marketing consent" });

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByText("Error")).toBeInTheDocument();
		await expect.element(page.getByTestId("check-result")).toHaveTextContent("error");

		await consentCheckbox.click();

		await expect.element(page.getByText("Error")).not.toBeInTheDocument();

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:true");
	});

	it("renders the TheCheckbox component markup with an inline label", () => {
		const wrapper = mount(TheCheckbox, {
			props: {
				id: "standalone-checkbox",
				label: "Standalone option",
				modelValue: true,
				name: "standalone",
				"onUpdate:modelValue": () => {},
			},
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		const input = wrapper.get("input");

		expect(wrapper.classes()).toContain("DFV-checkbox");
		expect(input.classes()).toContain("DFV-checkbox-input");
		expect(input.attributes("id")).toBe("standalone-checkbox");
		expect(input.attributes("name")).toBe("standalone");
		expect(wrapper.text()).toContain("Standalone option");
	});
});

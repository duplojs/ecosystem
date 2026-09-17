import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { page } from "vitest/browser";
import { defineComponent, h, ref } from "vue";
import { createForm, useCheckLayout, useMultiLayout, useRepeatLayout, useSectionLayout, type FormField } from "@V";
import { PrimaryButton, templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useTextInput, useTextareaInput } from "@V/designSystem";
import { createGridTemplates } from "@V/templates/grid";

describe("designSystem/TextInput", () => {
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
			addLabel: "Add alias",
			removeButton: templateFormRemoveButton,
			removeLabel: "Remove alias",
			resetButton: templateFormResetButton,
			resetLabel: "Reset alias",
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

	it("renders its label, placeholder and default value inside a real form", async() => {
		mountForm(
			useSectionLayout(
				useMultiLayout({
					name: useTextInput({
						label: "Full name",
						defaultValue: "Ada",
						props: {
							placeholder: "Grace Hopper",
						},
					}),
					notes: useTextareaInput({
						label: "Notes",
						defaultValue: "Context field",
					}),
				}),
				{ title: "Profile" },
			),
		);

		const nameInput = page.getByRole("textbox", { name: "Full name" });

		await expect.element(nameInput).toHaveValue("Ada");
		await expect.element(nameInput).toHaveAttribute("placeholder", "Grace Hopper");
		await expect.element(page.getByRole("textbox", { name: "Notes" })).toHaveValue("Context field");

		await nameInput.fill("Ada Lovelace");

		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"name\":\"Ada Lovelace\",\"notes\":\"Context field\"}");
	});

	it("displays validation feedback on submit and clears it after a valid text entry", async() => {
		mountForm(
			useCheckLayout(
				useTextInput({
					label: "Username",
					defaultValue: "",
					dataStructure: DDataStructure.string([DDataStructure.minCharacters(3)]),
					props: {
						placeholder: "alice",
					},
				}),
				{},
			),
		);

		const usernameInput = page.getByRole("textbox", { name: "Username" });

		await usernameInput.fill("Al");
		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByText("Error")).toBeInTheDocument();
		await expect.element(page.getByTestId("check-result")).toHaveTextContent("error");

		await usernameInput.fill("Alice");

		await expect.element(page.getByText("Error")).not.toBeInTheDocument();

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:\"Alice\"");
	});

	it("keeps repeated TextInput instances synchronized independently", async() => {
		mountForm(
			useRepeatLayout(
				useTextInput({
					label: "Alias",
					defaultValue: "",
					props: {
						placeholder: "Visible name",
					},
				}),
				{
					min: 2,
					max: 3,
				},
			),
		);

		const aliasInputs = page.getByRole("textbox", { name: "Alias" }).all();

		await expect.element(aliasInputs[0]!).toHaveValue("");
		await expect.element(aliasInputs[1]!).toHaveValue("");

		await aliasInputs[0]!.fill("Alpha");
		await aliasInputs[1]!.fill("Beta");

		await expect.element(page.getByTestId("current-value")).toHaveTextContent("[\"Alpha\",\"Beta\"]");

		await page.getByRole("button", { name: "Add alias" }).click();

		const updatedAliasInputs = page.getByRole("textbox", { name: "Alias" }).all();

		await expect.element(updatedAliasInputs[2]!).toHaveValue("");

		await updatedAliasInputs[2]!.fill("Gamma");
		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:[\"Alpha\",\"Beta\",\"Gamma\"]");
	});
});

import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { page } from "vitest/browser";
import { defineComponent, h, ref } from "vue";
import { createForm, useCheckLayout, useMultiLayout, useRepeatLayout, useSectionLayout, type FormField } from "@V";
import { PrimaryButton, templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useTextInput, useTextareaInput } from "@V/designSystem";
import { createGridTemplates } from "@V/templates/grid";

describe("designSystem/TextareaInput", () => {
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
			addLabel: "Add note",
			removeButton: templateFormRemoveButton,
			removeLabel: "Remove note",
			resetButton: templateFormResetButton,
			resetLabel: "Reset note",
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

	it("renders its textarea label, placeholder and default value in a profile form", async() => {
		mountForm(
			useSectionLayout(
				useMultiLayout({
					title: useTextInput({
						label: "Title",
						defaultValue: "Release notes",
					}),
					description: useTextareaInput({
						label: "Description",
						defaultValue: "Draft summary",
						props: {
							placeholder: "Write a detailed description",
						},
					}),
				}),
				{ title: "Article" },
			),
		);

		const descriptionInput = page.getByRole("textbox", { name: "Description" });

		await expect.element(descriptionInput).toHaveValue("Draft summary");
		await expect.element(descriptionInput).toHaveAttribute("placeholder", "Write a detailed description");

		await descriptionInput.fill("First line\nSecond line");

		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"title\":\"Release notes\",\"description\":\"First line\\nSecond line\"}");
	});

	it("displays validation feedback on submit and clears it after the textarea is long enough", async() => {
		mountForm(
			useCheckLayout(
				useTextareaInput({
					label: "Comment",
					defaultValue: "",
					dataStructure: DDataStructure.string([DDataStructure.minCharacters(10)]),
					props: {
						placeholder: "Share your feedback",
					},
				}),
				{},
			),
		);

		const commentInput = page.getByRole("textbox", { name: "Comment" });

		await commentInput.fill("Too short");
		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByText("Error")).toBeInTheDocument();
		await expect.element(page.getByTestId("check-result")).toHaveTextContent("error");

		await commentInput.fill("This comment is long enough.");

		await expect.element(page.getByText("Error")).not.toBeInTheDocument();

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:\"This comment is long enough.\"");
	});

	it("keeps repeated TextareaInput instances synchronized independently", async() => {
		mountForm(
			useRepeatLayout(
				useTextareaInput({
					label: "Note",
					defaultValue: "",
					props: {
						placeholder: "Write a note",
					},
				}),
				{
					min: 2,
					max: 3,
				},
			),
		);

		const noteInputs = page.getByRole("textbox", { name: "Note" }).all();

		await expect.element(noteInputs[0]!).toHaveValue("");
		await expect.element(noteInputs[1]!).toHaveValue("");

		await noteInputs[0]!.fill("Morning note");
		await noteInputs[1]!.fill("Evening note");

		await expect.element(page.getByTestId("current-value")).toHaveTextContent("[\"Morning note\",\"Evening note\"]");

		await page.getByRole("button", { name: "Add note" }).click();

		const updatedNoteInputs = page.getByRole("textbox", { name: "Note" }).all();

		await expect.element(updatedNoteInputs[2]!).toHaveValue("");

		await updatedNoteInputs[2]!.fill("Night note");
		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:[\"Morning note\",\"Evening note\",\"Night note\"]");
	});
});

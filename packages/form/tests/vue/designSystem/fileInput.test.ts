import type * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { mount } from "@vue/test-utils";
import { page } from "vitest/browser";
import { defineComponent, h, ref } from "vue";
import { createForm, useCheckLayout, useMultiLayout, useSectionLayout, type FormField } from "@V";
import { FileInput, PrimaryButton, templateFormAddButton, templateFormNextButton, templateFormPreviousButton, templateFormRemoveButton, templateFormResetButton, templateFormSelect, useFileInput, useTextInput } from "@V/designSystem";
import { createGridTemplates } from "@V/templates/grid";

describe("designSystem/FileInput", () => {
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
			addLabel: "Add file",
			removeButton: templateFormRemoveButton,
			removeLabel: "Remove file",
			resetButton: templateFormResetButton,
			resetLabel: "Reset file",
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

	function formatValue(value: unknown): string {
		return JSON.stringify(
			value,
			(_key, currentValue: unknown) => currentValue instanceof File
				? {
					name: currentValue.name,
					size: currentValue.size,
					type: currentValue.type,
				}
				: currentValue,
		);
	}

	function mountForm(formField: FormField) {
		const useForm = createForm(gridTemplates.useTemplates());
		const form = useForm(formField);
		const checkResult = ref("not checked");
		const Harness = defineComponent({
			setup() {
				async function submit() {
					const result = await form.check();

					checkResult.value = DEither.isRight(result)
						? `success:${formatValue(DEither.unwrapRight(result))}`
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
							formatValue(form.currentValue.value),
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

	function createRequiredFilesStructure(): DDataStructure.Structure {
		return {
			asyncParse(value: unknown) {
				return Promise.resolve(
					value instanceof Array && value.length > 0
						? DEither.right("parse-success", value)
						: DEither.left("parse-error", {
							issues: [
								{
									message: "Upload required",
								},
							],
						}),
				);
			},
		} as never;
	}

	it("renders accept and multiple props and synchronizes uploaded files in a real form", async() => {
		mountForm(
			useSectionLayout(
				useMultiLayout({
					title: useTextInput({
						label: "Document title",
						defaultValue: "Quarterly report",
					}),
					attachments: useFileInput({
						label: "Attachments",
						props: {
							accept: ".txt,text/plain",
							multiple: true,
						},
					}),
				}),
				{ title: "Documents" },
			),
		);

		const attachmentsInput = page.getByLabelText("Attachments");
		const firstFile = new File(["alpha"], "alpha.txt", { type: "text/plain" });
		const secondFile = new File(["beta"], "beta.txt", { type: "text/plain" });

		await expect.element(attachmentsInput).toHaveAttribute("accept", ".txt,text/plain");
		await expect.element(attachmentsInput).toHaveAttribute("multiple", "");

		await attachmentsInput.upload([firstFile, secondFile]);

		await expect.element(page.getByTestId("current-value")).toHaveTextContent("{\"title\":\"Quarterly report\",\"attachments\":[{\"name\":\"alpha.txt\",\"size\":5,\"type\":\"text/plain\"},{\"name\":\"beta.txt\",\"size\":4,\"type\":\"text/plain\"}]}");
	});

	it("uploads a single file and returns it on submit", async() => {
		mountForm(
			useFileInput({
				label: "Resume",
				props: {
					accept: "application/pdf",
				},
			}),
		);

		const resumeInput = page.getByLabelText("Resume");
		const resumeFile = new File(["pdf content"], "resume.pdf", { type: "application/pdf" });

		await resumeInput.upload(resumeFile);
		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:[{\"name\":\"resume.pdf\",\"size\":11,\"type\":\"application/pdf\"}]");
	});

	it("clears the value when the selected file list becomes empty", async() => {
		mountForm(
			useFileInput({
				label: "Avatar",
			}),
		);

		const avatarInput = page.getByLabelText("Avatar");

		await avatarInput.upload(new File(["avatar"], "avatar.txt", { type: "text/plain" }));

		await expect.element(page.getByTestId("current-value")).toHaveTextContent("[{\"name\":\"avatar.txt\",\"size\":6,\"type\":\"text/plain\"}]");

		await avatarInput.upload([]);

		await expect.element(page.getByTestId("current-value")).toHaveTextContent("");
	});

	it("renders the FileInput component markup with default props", () => {
		const wrapper = mount(FileInput, {
			props: {
				modelValue: null,
				"onUpdate:modelValue": () => {},
			},
			attachTo: document.body,
		});

		mountedWrappers.push(wrapper);

		const input = wrapper.get("input");

		expect(input.classes()).toContain("DFV-file-input");
		expect(input.attributes("type")).toBe("file");
		expect(input.attributes("accept")).toBeUndefined();
		expect(input.attributes("multiple")).toBeUndefined();
	});

	it("displays validation feedback on submit and clears it after a file upload", async() => {
		mountForm(
			useCheckLayout(
				useFileInput({
					label: "Invoice",
					dataStructure: createRequiredFilesStructure(),
				}),
				{},
			),
		);

		const invoiceInput = page.getByLabelText("Invoice");

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByText("Upload required")).toBeInTheDocument();
		await expect.element(page.getByTestId("check-result")).toHaveTextContent("error");

		await invoiceInput.upload(new File(["invoice"], "invoice.txt", { type: "text/plain" }));

		await expect.element(page.getByText("Upload required")).not.toBeInTheDocument();

		await page.getByRole("button", { name: "Submit" }).click();

		await expect.element(page.getByTestId("check-result")).toHaveTextContent("success:[{\"name\":\"invoice.txt\",\"size\":7,\"type\":\"text/plain\"}]");
	});
});

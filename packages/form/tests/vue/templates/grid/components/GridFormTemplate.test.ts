import { createApp, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import GridFormTemplate from "@V/templates/grid/components/GridFormTemplate.vue";

describe("templates/grid/components/GridFormTemplate", () => {
	it("renders form fields, submitter and grid styles", async() => {
		const submit = vi.fn();
		const root = document.createElement("div");
		const app = createApp(
			() => h(
				GridFormTemplate,
				{
					fieldKey: "FORM",
					gap: 12,
					getCurrentValue: () => undefined,
					maxColumns: 4,
					onSubmit: submit,
				},
				{
					formField: () => h("span", { id: "form-field" }, "field"),
					submitter: () => h("button", { id: "submitter" }, "submit"),
				},
			),
		);

		app.mount(root);

		const formField = root.querySelector("#form-field");
		const submitter = root.querySelector("#submitter");
		const container = root.querySelector<HTMLElement>(".DFV-grid-container");
		const form = root.querySelector("form");

		expect(formField?.textContent).toBe("field");
		expect(submitter?.textContent).toBe("submit");
		expect(container?.attributes.getNamedItem("style")?.value).toContain("--DFV-grid-max-columns: 4;");
		expect(container?.attributes.getNamedItem("style")?.value).toContain("--DFV-grid-gap: 12px;");

		form?.dispatchEvent(
			new SubmitEvent(
				"submit",
				{
					bubbles: true,
					cancelable: true,
				},
			),
		);
		await nextTick();

		expect(submit).toHaveBeenCalledOnce();

		app.unmount();
	});

	it("renders through vue test utils", async() => {
		const wrapper = mount(GridFormTemplate, {
			props: {
				fieldKey: "FORM",
				getCurrentValue: () => "current",
			},
			slots: {
				formField: "<span id=\"form-field\">field</span>",
				submitter: "<button id=\"submitter\">submit</button>",
			},
		});

		expect(wrapper.find("#form-field").text()).toBe("field");
		expect(wrapper.find("#submitter").text()).toBe("submit");

		await wrapper.find("form").trigger("submit");

		expect(wrapper.emitted("submit")).toHaveLength(1);
	});

	it("omits the gap style when no gap is provided", () => {
		const wrapper = mount(GridFormTemplate, {
			props: {
				fieldKey: "FORM",
				getCurrentValue: () => undefined,
			},
		});

		expect(wrapper.find(".DFV-grid-container").attributes("style")).toBeUndefined();
	});
});

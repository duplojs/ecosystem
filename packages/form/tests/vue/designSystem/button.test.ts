import { mount, type VueWrapper } from "@vue/test-utils";
import { page } from "vitest/browser";
import { defineComponent, h } from "vue";
import { createForm } from "@V";
import { TheButton, useTextInput } from "@V/designSystem";
import { iconMapper } from "@V/designSystem/components/button/iconMapper";
import { useStepLayout } from "@V/layouts";
import { templatesGrid } from "@test-utils/vue/grid";

describe("designSystem/Button", () => {
	const mountedWrappers: ReturnType<typeof mount>[] = [];

	afterEach(() => {
		mountedWrappers.forEach(
			(wrapper) => void wrapper.unmount(),
		);
		mountedWrappers.length = 0;
		document.body.innerHTML = "";
	});

	function mountButton(props: InstanceType<typeof TheButton>["$props"]) {
		const wrapper = mount(TheButton, {
			props,
		});

		mountedWrappers.push(wrapper);

		return wrapper;
	}

	async function waitForSelector(wrapper: VueWrapper, selector: string) {
		await vi.waitFor(() => {
			expect(wrapper.find(selector).exists()).toBe(true);
		});
	}

	it("renders label, props and start icon with the button size fallback", async() => {
		const wrapper = mountButton({
			label: "Next step",
			icon: "next",
			variant: "outline",
			size: "lg",
			type: "submit",
			disabled: true,
		});

		await waitForSelector(wrapper, "svg[data-dfv-icon='next']");

		const button = wrapper.get("button");
		const icon = wrapper.get("svg[data-dfv-icon='next']");

		expect(button.text()).toBe("Next step");
		expect(button.classes()).toEqual([
			"DFV-button",
			"DFV-button-variant-outline",
			"DFV-button-size-lg",
		]);
		expect(button.attributes("type")).toBe("submit");
		expect(button.attributes()).toHaveProperty("disabled");
		expect(icon.attributes("style")).toContain("--DFV-icon-size: 1.125rem");
		expect(button.element.firstElementChild).toBe(icon.element);
	});

	it("renders an end icon with an explicit icon size", async() => {
		const wrapper = mountButton({
			label: "Add item",
			icon: "plus",
			iconPosition: "end",
			iconSize: "2xl",
			variant: "ghost",
			size: "sm",
			type: "reset",
		});

		await waitForSelector(wrapper, "svg[data-dfv-icon='plus']");

		const button = wrapper.get("button");
		const icon = wrapper.get("svg[data-dfv-icon='plus']");

		expect(button.classes()).toContain("DFV-button-variant-ghost");
		expect(button.classes()).toContain("DFV-button-size-sm");
		expect(button.attributes("type")).toBe("reset");
		expect(icon.attributes("style")).toContain("--DFV-icon-size: 1.5rem");
		expect(button.element.lastElementChild).toBe(icon.element);
	});

	it("renders an end icon with the button size fallback", async() => {
		const wrapper = mountButton({
			icon: "previous",
			iconPosition: "end",
			size: "2xl",
		});

		await waitForSelector(wrapper, "svg[data-dfv-icon='previous']");

		const button = wrapper.get("button");
		const icon = wrapper.get("svg[data-dfv-icon='previous']");

		expect(button.text()).toBe("");
		expect(icon.attributes("style")).toContain("--DFV-icon-size: 1.5rem");
		expect(button.element.firstElementChild).toBe(icon.element);
	});

	it("does not render a label or an icon when none is provided", () => {
		const wrapper = mountButton({
			variant: "destructive",
			size: "xl",
		});

		const button = wrapper.get("button");

		expect(button.text()).toBe("");
		expect(button.classes()).toContain("DFV-button-variant-destructive");
		expect(button.classes()).toContain("DFV-button-size-xl");
		expect(button.attributes("type")).toBe("button");
		expect(button.attributes()).not.toHaveProperty("disabled");
		expect(wrapper.find("span").exists()).toBe(false);
		expect(wrapper.find("svg").exists()).toBe(false);
	});

	it("maps every icon key to its matching icon component", async() => {
		const iconNames = {
			next: "next",
			previous: "previous",
			plus: "plus",
			remove: "remove",
			reset: "reset",
			minus: "minus",
		} as const satisfies Record<keyof typeof iconMapper, string>;

		const Harness = defineComponent({
			setup() {
				return () => h(
					"div",
					Object.entries(iconMapper).map(
						([name, component]) => h(component, {
							"data-testid": name,
							size: "sm",
						}),
					),
				);
			},
		});

		const wrapper = mount(Harness);

		mountedWrappers.push(wrapper);

		await vi.waitFor(() => {
			expect(wrapper.findAll("svg[data-dfv-icon]").length).toBe(Object.keys(iconNames).length);
		});

		for (const [iconKey, iconName] of Object.entries(iconNames)) {
			const icon = wrapper.get(`[data-testid='${iconKey}']`);

			expect(icon.attributes("data-dfv-icon")).toBe(iconName);
		}
	});

	it("renders and uses design system step navigation buttons", async() => {
		const { component } = createForm(templatesGrid.useTemplates())(
			useStepLayout(
				[
					useTextInput({
						label: "First",
						defaultValue: "one",
					}),
					useTextInput({
						label: "Second",
						defaultValue: "two",
					}),
				],
				{
					errorMessageNotAtLastStep: "Complete every step",
				},
			),
		);

		const wrapper = mount(component, {
			attachTo: document.body,
		});
		mountedWrappers.push(wrapper);

		const next = page.getByRole("button", {
			name: "Continue",
		});

		const previous = page.getByRole("button", {
			name: "Back",
		});

		await expect.element(previous).toBeDisabled();
		await expect.element(next).toBeEnabled();
		await waitForSelector(wrapper, ".DFV-step-actions svg[data-dfv-icon='previous']");
		await waitForSelector(wrapper, ".DFV-step-actions svg[data-dfv-icon='next']");

		await next.click();

		await expect.element(
			page.getByRole("textbox", { name: "Second" }),
		).toBeVisible();

		await expect.element(previous).toBeEnabled();
		await expect.element(next).toBeDisabled();

		await previous.click();

		await expect.element(
			page.getByRole("textbox", { name: "First" }),
		).toBeVisible();
	});
});

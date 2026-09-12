import { createComponentInteraction, createStepWrapper } from "./componentInteraction";
import { Assertions } from "./assertions";
import { expect, type Locator as PlaywrightLocator } from "playwright/test";

export namespace Actions {

	export const click = createComponentInteraction(
		"$component: I click on $element.",
		async({ element, elementKey, component }) => {
			await Assertions.toBeVisible(component, elementKey);

			return element.click();
		},
	);

	export const forceClick = createComponentInteraction(
		"$component: I force click on $element.",
		({ element }) => element.click({ force: true }),
	);

	export const hover = createComponentInteraction(
		"$component: I hover $element.",
		async({ element, elementKey, component }) => {
			await Assertions.toBeVisible(component, elementKey);

			return element.hover();
		},
	);

	export const focus = createComponentInteraction(
		"$component: I focus $element.",
		async({ element, elementKey, component }) => {
			await Assertions.toBeVisible(component, elementKey);

			return element.focus();
		},
	);

	export const fill = createComponentInteraction(
		"$component: I fill on $element.",
		async({ element, elementKey, component }, content: string) => {
			await Assertions.toBeVisible(component, elementKey);

			return element.fill(content);
		},
	);

	export const type = createComponentInteraction(
		"$component: I type on $element.",
		async(
			{ element, elementKey, component },
			text: string,
			options?: Parameters<PlaywrightLocator["pressSequentially"]>[1],
		) => {
			await Assertions.toBeVisible(component, elementKey);

			return element.pressSequentially(text, options);
		},
	);

	export const clear = createComponentInteraction(
		"$component: I clear $element.",
		async({ element, elementKey, component }) => {
			await Assertions.toBeVisible(component, elementKey);

			return element.clear();
		},
	);

	export const press = createComponentInteraction(
		"$component: I press on $element.",
		async({ element, elementKey, component }, key: string) => {
			await Assertions.toBeVisible(component, elementKey);

			return element.press(key);
		},
	);

	export const check = createComponentInteraction(
		"$component: I check $element.",
		async({ element, elementKey, component }) => {
			await Assertions.toBeVisible(component, elementKey);

			return element.check();
		},
	);

	export const uncheck = createComponentInteraction(
		"$component: I uncheck $element.",
		async({ element, elementKey, component }) => {
			await Assertions.toBeVisible(component, elementKey);

			return element.uncheck();
		},
	);

	export const selectOption = createComponentInteraction(
		"$component: I select option on $element.",
		async(
			{ element, elementKey, component },
			values: Parameters<PlaywrightLocator["selectOption"]>[0],
		) => {
			await Assertions.toBeVisible(component, elementKey);

			return element.selectOption(values);
		},
	);

	export const dragTo = createComponentInteraction(
		"$component: I drag $element to target.",
		async(
			{ element, elementKey, component },
			target: PlaywrightLocator,
			options?: Parameters<PlaywrightLocator["dragTo"]>[1],
		) => {
			await Assertions.toBeVisible(component, elementKey);
			await expect(target).toBeVisible();

			return element.dragTo(target, options);
		},
	);

	export const extractContent = createComponentInteraction(
		"$component: I extract content of $element.",
		async({ element, component, elementKey }) => {
			await Assertions.toBeVisible(component, elementKey);

			return element.textContent();
		},
	);

	export const withStep = createStepWrapper({
		click,
		forceClick,
		hover,
		focus,
		fill,
		type,
		clear,
		press,
		check,
		uncheck,
		selectOption,
		dragTo,
		extractContent,
	});
}

import { createStepWrapper, createComponentInteraction } from "./componentInteraction";
import { expect } from "playwright/test";

export namespace Assertions {

	export const toBeVisible = createComponentInteraction(
		"$component: I want $element is visible.",
		async({ element }) => {
			await element.scrollIntoViewIfNeeded();

			await expect(element).toBeVisible();
		},
	);

	export const toHaveText = createComponentInteraction(
		"$component: I want $element have Text.",
		async({ element, component, elementKey }, text: string | RegExp) => {
			await toBeVisible(component, elementKey);

			return expect(element).toHaveText(text);
		},
	);

	export const toContainText = createComponentInteraction(
		"$component: I want $element contain Text.",
		async({ element, component, elementKey }, text: string | RegExp) => {
			await toBeVisible(component, elementKey);

			return expect(element).toContainText(text);
		},
	);

	export const toHaveNoText = createComponentInteraction(
		"$component: I want $element have no Text.",
		async({ element, component, elementKey }) => {
			await toBeVisible(component, elementKey);

			return expect(element).toHaveText("");
		},
	);

	export const toBeHidden = createComponentInteraction(
		"$component: I want $element is hidden.",
		async({ element }) => expect(element).toBeHidden(),
	);

	export const toHaveQuantity = createComponentInteraction(
		"$component: I check quantity of $element.",
		async({ element }, { quantity, operator }: {
			quantity: number;
			operator?: "lte" | "gte" | "e";
		}) => {
			if (operator === "gte") {
				return expect.poll(() => element.count(), { timeout: 5000 }).toBeGreaterThanOrEqual(quantity);
			} else if (operator === "lte") {
				return expect.poll(() => element.count(), { timeout: 5000 }).toBeLessThanOrEqual(quantity);
			} else {
				return expect.poll(() => element.count(), { timeout: 5000 }).toBe(quantity);
			}
		},
	);

	export const toBeEnabled = createComponentInteraction(
		"$component: I want $element is enabled.",
		async({ element, component, elementKey }) => {
			await toBeVisible(component, elementKey);

			return expect(element).toBeEnabled();
		},
	);

	export const toBeChecked = createComponentInteraction(
		"$component: I want $element is checked.",
		async({ element, component, elementKey }) => {
			await toBeVisible(component, elementKey);

			return expect(element).toBeChecked();
		},
	);

	export const toBeDisabled = createComponentInteraction(
		"$component: I want $element is disabled.",
		async({ element, component, elementKey }) => {
			await toBeVisible(component, elementKey);

			return expect(element).toBeDisabled();
		},
	);

	export const toHaveAttribute = createComponentInteraction(
		"$component: I want $element have attribute.",
		async({ element, component, elementKey }, name: string, value?: string | RegExp) => {
			await toBeVisible(component, elementKey);

			if (value === undefined) {
				return expect(element).toHaveAttribute(name, /.+/);
			}

			return expect(element).toHaveAttribute(name, value);
		},
	);

	export const toHaveClass = createComponentInteraction(
		"$component: I want $element have class.",
		async({ element, component, elementKey }, value: string | RegExp) => {
			await toBeVisible(component, elementKey);

			return expect(element).toHaveClass(value);
		},
	);

	export const toHaveValue = createComponentInteraction(
		"$component: I want $element have value.",
		async({ element, component, elementKey }, value: string | RegExp) => {
			await toBeVisible(component, elementKey);

			return expect(element).toHaveValue(value);
		},
	);

	export const toBeBusy = createComponentInteraction(
		"$component: I want $element is busy.",
		async({ element, component, elementKey }) => {
			await toBeVisible(component, elementKey);

			return expect(element).toHaveAttribute("aria-busy", "true");
		},
	);

	export const toBeNotBusy = createComponentInteraction(
		"$component: I want $element is not busy.",
		async({ element, component, elementKey }) => {
			await toBeVisible(component, elementKey);

			return expect(element).toHaveAttribute("aria-busy", "false");
		},
	);

	export const withStep = createStepWrapper({
		toBeVisible,
		toHaveText,
		toContainText,
		toHaveNoText,
		toBeHidden,
		toHaveQuantity,
		toBeEnabled,
		toBeChecked,
		toBeDisabled,
		toHaveAttribute,
		toHaveClass,
		toHaveValue,
		toBeBusy,
		toBeNotBusy,
	});
}

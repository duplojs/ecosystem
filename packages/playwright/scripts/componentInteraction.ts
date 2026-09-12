
import test, { type Locator as PlaywrightLocator } from "playwright/test";
import type { Component, ComponentElements } from "./component";
import * as DKind from "@duplojs/lang/kind";
import * as DCommon from "@duplojs/lang/common";
import { createKind } from "./kind";

interface ContextStepEmbedded {
	component: Component<string, ComponentElements>;
	elementKey: string;
	element: PlaywrightLocator;
}

export type StepEmbeddedFunction = (context: ContextStepEmbedded, ...args: any) => any;

interface MissingComponentElementErrorParams {
	componentName: string;
	elementKey: string;
	availableElements: string[];
}

export type ElementsSelector<
	GenericElementKey extends string,
> = [
	element: GenericElementKey,
	target: number | "first" | "last",
];

const missingComponentElementErrorKind = createKind("missing-component-element-error");

export class MissingComponentElementError extends DKind.parentClass(
	missingComponentElementErrorKind,
	Error,
) {
	public constructor(
		public params: MissingComponentElementErrorParams,
	) {
		super(
			{
				[missingComponentElementErrorKind.definition.name]: params,
			},
			[
				`Missing element "${params.elementKey}" on component "${params.componentName}".`,
				`Available elements: ${params.availableElements.join(", ") || "none"}.`,
			].join(" "),
		);
	}
}

export function createComponentInteraction<
	GenericStepEmbeddedFunction extends StepEmbeddedFunction,
>(
	stepName: string,
	step: GenericStepEmbeddedFunction,
) {
	return <
		GenericComponent extends Component<string, Record<string, PlaywrightLocator>, any, any>,
		GenericElementKey extends (
			| Extract<keyof GenericComponent["elements"], string>
			| ElementsSelector<Extract<keyof GenericComponent["elements"], string>>
		),
	>(
		component: GenericComponent,
		elementSelector: GenericElementKey,
		...args: Parameters<GenericStepEmbeddedFunction> extends [any, ...infer InferredRest] ? InferredRest : never
	) => {
		const [elementKey, elementDesignation] = typeof elementSelector === "string"
			? [elementSelector, elementSelector]
			: [elementSelector[0], `${elementSelector[0]}::${elementSelector[1]}`];

		const element = DCommon.justExec(() => {
			const selectedElement = component.elements?.[elementKey];

			if (!selectedElement) {
				throw new MissingComponentElementError({
					componentName: component.name,
					elementKey: elementKey.toString(),
					availableElements: Object.keys(component.elements ?? {}),
				});
			} else if (typeof elementSelector === "string") {
				return selectedElement;
			} else if (elementSelector[1] === "first") {
				return selectedElement.first();
			} else if (elementSelector[1] === "last") {
				return selectedElement.last();
			} else {
				return selectedElement.nth(elementSelector[1]);
			}
		});

		return test.step(
			stepName
				.replace("$component", component.name)
				.replace("$element", elementDesignation),
			() => step(
				{
					element,
					component,
					elementKey,
				},
				...args,
			),
		);
	};
}

export type WrapperStepEmbeddedFunction = Record<string, ReturnType<typeof createComponentInteraction>>;

export function createStepWrapper<
	GenericWrapperStepEmbeddedFunction extends WrapperStepEmbeddedFunction,
>(
	wrapperStepEmbeddedFunction: GenericWrapperStepEmbeddedFunction,
) {
	return (stepName: string) => new Proxy(
		wrapperStepEmbeddedFunction,
		{
			get(target, prop: string) {
				const wrappedStep = target[
					prop as keyof GenericWrapperStepEmbeddedFunction
				] as (...args: unknown[]) => unknown;

				return (...args: unknown[]) => test.step(stepName, () => wrappedStep(...args));
			},
		},
	) as GenericWrapperStepEmbeddedFunction;
}

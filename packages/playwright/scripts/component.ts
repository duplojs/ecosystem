import test, { expect, type Locator as PlaywrightLocator } from "playwright/test";
import type { Website } from "./website";
import { createKind } from "./kind";
import type * as DKind from "@duplojs/lang/kind";

export type ComponentElements = Record<string, PlaywrightLocator>;

export type ComponentMethods = Record<string, (...args: any[]) => any>;

export interface ComponentEngine {
	(website: Website): Component<any, any, any, any>;
	componentName: string;
}

type FormatComponent<
	GenericComponent extends ComponentEngine,
> = {
	[Component in GenericComponent as Component["componentName"]]: Component
};

const componentKind = createKind("component");

export interface Component<
	GenericName extends string = string,
	GenericElements extends ComponentElements | undefined = ComponentElements | undefined,
	GenericMethods extends ComponentMethods | undefined = undefined,
	GenericComponent extends ComponentEngine = never,
> extends DKind.Kind<typeof componentKind, GenericName> {
	name: GenericName;
	get mainElement(): PlaywrightLocator;
	elements: GenericElements;
	methods: GenericMethods;
	iWantToSeeComponent<
		GenericComponentName extends GenericComponent["componentName"],
	>(
		componentName: GenericComponentName,
	): Promise<ReturnType<Extract<GenericComponent, { componentName: GenericComponentName }>>>;
	components: FormatComponent<GenericComponent>;
}

export interface GetComponentMainElementParams {
	body: PlaywrightLocator;
}

export interface GetComponentElementsParams {
	mainElement: PlaywrightLocator;
	body: PlaywrightLocator;
}

export interface GetComponentMethodsParams<
	GenericElements extends ComponentElements | undefined,
> {
	mainElement: PlaywrightLocator;
	body: PlaywrightLocator;
	elements: GenericElements;
	website: Website;
}

export function createComponent<
	GenericName extends string,
	GenericElements extends ComponentElements | undefined = undefined,
	GenericMethods extends ComponentMethods | undefined = undefined,
	GenericComponent extends ComponentEngine = never,
>(
	name: GenericName,
	params: {
		getMainElement(params: GetComponentMainElementParams): PlaywrightLocator;
		getElements?(params: GetComponentElementsParams): GenericElements;
		getMethods?(params: GetComponentMethodsParams<GenericElements>): GenericMethods;
		components?: GenericComponent[];
	},
) {
	const componentWrapper = Object.fromEntries(
		params.components?.map((component) => [component.componentName, component]) ?? [],
	);

	function component(
		website: Website,
	): Component<GenericName, GenericElements, GenericMethods, GenericComponent> {
		const body = website.playwrightPage.locator("body");
		const mainElement = params.getMainElement({ body });

		const elements = params.getElements?.({
			mainElement,
			body,
		});

		const methods = params.getMethods?.({
			mainElement,
			body,
			elements: elements as never,
			website,
		});

		const methodsWithProxy = new Proxy((methods ?? {}) as ComponentMethods, {
			get(target, key: string) {
				return (...args: unknown[]) => test.step(
					`${name}: Call method ${key.toString()}.`,
					() => target[key]!(...args),
				);
			},
		}) as GenericMethods;

		return componentKind.setTo(
			{
				name,
				mainElement,
				elements,
				methods: methodsWithProxy,
				components: componentWrapper as FormatComponent<GenericComponent>,
				iWantToSeeComponent: async(componentName: string) => {
					const component = componentWrapper[componentName]!(website);

					await test.step(`${name}: I want to see ${component.name}`, async() => {
						await expect(component.mainElement).toBeVisible();
					});

					return component;
				},
			} satisfies Record<keyof DKind.Remove<Component>, any>,
			name,
		) as never;
	}

	component.componentName = name;

	return component;
}

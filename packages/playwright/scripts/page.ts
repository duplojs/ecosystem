import type { Locator as PlaywrightLocator } from "playwright/test";
import type * as DKind from "@duplojs/lang/kind";
import { type ComponentEngine, type ComponentMethods, type GetComponentMethodsParams, type GetComponentElementsParams, type GetComponentMainElementParams, createComponent, type ComponentElements, type Component } from "./component";
import type { Website } from "./website";
import { createKind } from "./kind";

const pageKind = createKind("page");

export interface PageEngine<
	GenericName extends string = string,
	GenericPathParams extends Record<string, unknown> = Record<string, unknown>,
	GenericElements extends ComponentElements | undefined = undefined,
	GenericMethods extends ComponentMethods | undefined = undefined,
	GenericComponent extends ComponentEngine = never,
> {
	(website: Website): Page<GenericName, GenericPathParams, GenericElements, GenericMethods, GenericComponent>;
	componentName: GenericName;
}

type InferPagePathParams<
	GenericMakePath extends (...args: any[]) => string,
> = Parameters<GenericMakePath> extends []
	? Record<string, unknown>
	: Parameters<GenericMakePath>[0] extends Record<string, unknown>
		? Parameters<GenericMakePath>[0]
		: never;

type _Page<
	GenericName extends string,
	GenericElement extends ComponentElements | undefined,
	GenericMethods extends ComponentMethods | undefined,
	GenericComponent extends ComponentEngine,
> = (
	& Component<
		GenericName,
		GenericElement,
		GenericMethods,
		GenericComponent
	>
	& DKind.Kind<typeof pageKind, GenericName>
);

export interface Page<
	GenericName extends string = string,
	GenericPathParams extends Record<string, unknown> = Record<string, unknown>,
	GenericElement extends ComponentElements | undefined = ComponentElements | undefined,
	GenericMethods extends ComponentMethods | undefined = undefined,
	GenericComponent extends ComponentEngine = never,
> extends _Page<
		GenericName,
		GenericElement,
		GenericMethods,
		GenericComponent
	> {
	makePath(
		...args: {} extends GenericPathParams
			? [params?: GenericPathParams]
			: [params: GenericPathParams]
	): string;
}

export function createPage<
	GenericName extends string,
	GenericMakePath extends(...args: any[]) => string,
	GenericElements extends ComponentElements | undefined = undefined,
	GenericMethods extends ComponentMethods | undefined = undefined,
	GenericComponent extends ComponentEngine = never,
>(
	name: GenericName,
	params: {
		makePath: GenericMakePath;
		getMainElement(params: GetComponentMainElementParams): PlaywrightLocator;
		getElements?(params: GetComponentElementsParams): GenericElements;
		getMethods?(params: GetComponentMethodsParams<GenericElements>): GenericMethods;
		components?: GenericComponent[];
	},
): PageEngine<GenericName, InferPagePathParams<GenericMakePath>, GenericElements, GenericMethods, GenericComponent> {
	const component = createComponent(name, params);

	function page(
		website: Website,
	): Page<GenericName, InferPagePathParams<GenericMakePath>, GenericElements, GenericMethods, GenericComponent> {
		const pageBase = component(website);

		return pageKind.setTo(
			{
				...pageBase,
				makePath: params.makePath,
			} as never,
			name,
		);
	}

	page.componentName = name;

	return page;
}

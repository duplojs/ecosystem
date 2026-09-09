import * as DKind from "@scripts/kind";
import type * as DObject from "@scripts/object";
import { createGlobalStore } from "./globalStore";
import type { IsEqual, AnyFunction, ObjectKey } from "./types";
import { createKind } from "./kind";

const BuilderStoreSymbol = Symbol("BuilderStoreSymbol");
type BuilderStoreSymbol = typeof BuilderStoreSymbol;

declare module "./globalStore" {
	interface GlobalStore {
		[BuilderStoreSymbol]: Record<
			string,
			Record<string, Parameters<BuilderHandler["set"]>[1]>
		>;
	}
}

const builderStore = createGlobalStore(BuilderStoreSymbol, {});

export const builderKind = createKind<
	"builder-base",
	object
>("builder-base");

export interface Builder<
	GenericAccumulator extends object = object,
	GenericIdentifier extends ObjectKey = never,
> extends DKind.Kind<
		typeof builderKind,
		GenericAccumulator
	> {

}

const builderNextKind = createKind("builder-next");

interface BuilderNext<
	GenericValue extends object = object,
> extends DKind.Kind<typeof builderNextKind, GenericValue> {

}

export interface BuilderHandlerSetFunctionParams<
	GenericArgs extends unknown[],
	GenericValue extends object,
> {
	args: GenericArgs;
	accumulator: GenericValue;
	next(
		newAccumulator: GenericValue
	): BuilderNext<
		GenericValue
	>;
}

export interface BuilderHandler<
	GenericBuilder extends Builder = Builder,
> {
	set<
		GenericMethodName extends DObject.GetPropsWithValueExtends<GenericBuilder, AnyFunction>,
		GenericMethod extends Extract<GenericBuilder[GenericMethodName], AnyFunction>,
	>(
		method: GenericMethodName,
		theFunction: (
			params: BuilderHandlerSetFunctionParams<
				Parameters<GenericMethod>,
				DKind.GetValue<typeof builderKind, GenericBuilder>
			>,
		) => IsEqual<
			keyof ReturnType<GenericMethod>,
			keyof GenericBuilder
		> extends true
			? BuilderNext<
				DKind.GetValue<typeof builderKind, GenericBuilder>
			>
			: ReturnType<GenericMethod>
	): BuilderHandler<GenericBuilder>;

	use<
		GenericCurrentBuilder extends GenericBuilder,
	>(
		accumulator: DKind.GetValue<typeof builderKind, GenericBuilder>
	): GenericCurrentBuilder;
}

export class MissingBuilderMethodsError extends DKind.parentClass(
	createKind("missing-builder-methods-error"),
	Error,
) {
	public constructor(
		public method: string,
	) {
		super(`Missing builder method: ${method}`);
	}
}

export function createBuilder<
	GenericBuilder extends Builder,
>(
	builderName: string,
) {
	const store = builderStore.value[builderName] ?? {};

	builderStore.set({
		...builderStore.value,
		[builderName]: store,
	});

	const builderHandler: BuilderHandler<GenericBuilder> = {
		set(
			method,
			theFunction,
		) {
			store[method] = theFunction as never;

			return builderHandler;
		},
		use(
			accumulator,
		) {
			return new Proxy(
				builderKind.addTo(
					store,
					accumulator,
				),
				{
					get(target, prop: string) {
						if (prop === builderKind.runTimeKey) {
							return target[prop];
						}

						if (!target[prop]) {
							throw new MissingBuilderMethodsError(prop);
						}

						const theFunction = target[prop];

						return (...args: never) => {
							const result = theFunction({
								args,
								accumulator,
								next: (newAccumulator: object) => builderNextKind.addTo(
									{},
									newAccumulator,
								),
							});

							if (builderNextKind.has(result)) {
								return builderHandler.use(
									builderNextKind.getValue(result),
								);
							}

							return result;
						};
					},
				},
			) as never;
		},
	};

	return builderHandler;
}

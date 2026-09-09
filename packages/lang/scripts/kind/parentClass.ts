import { create, type Kind, type Definition, type Handler } from "./base";
import type * as DCommon from "@scripts/common";

export type KindClass<
	GenericKindHandler extends Handler,
	GenericParent extends DCommon.AnyAbstractConstructor = DCommon.AnyAbstractConstructor<unknown[], never>,
> = (
	& (
		new<
			GenericKindValue extends GenericKindHandler["definition"]["value"] = GenericKindHandler["definition"]["value"],
			GenericParentInstance extends InstanceType<GenericParent> = InstanceType<GenericParent>,
		>(
			kindValue: GenericKindValue,
			...args: DCommon.NeverCoalescing<ConstructorParameters<GenericParent>, []>
		) => (
			& DCommon.NeverCoalescing<GenericParentInstance, {}>
			& Kind<GenericKindHandler, GenericKindValue>
		)
	)
	& (
		DCommon.IsEqual<GenericParent, never> extends true
			? {}
			: {
				[Prop in Exclude<keyof GenericParent, DCommon.ClearClassKeys>]: GenericParent[Prop]
			}
	)
);

export function parentClass<
	GenericKindName extends string,
	GenericParent extends object = never,
>(
	kind: GenericKindName,
	parent?: (
		& GenericParent
		& DCommon.RequireConstructor<GenericParent>
	),
): KindClass<
	Handler<Definition<GenericKindName>>,
	Extract<GenericParent, DCommon.AnyAbstractConstructor>
>;

export function parentClass<
	GenericKindHandler extends Handler,
	GenericParent extends object = never,
>(
	kindHandler: GenericKindHandler,
	parent?: (
		& GenericParent
		& DCommon.RequireConstructor<GenericParent>
	),
): KindClass<
	GenericKindHandler,
	Extract<GenericParent, DCommon.AnyAbstractConstructor>
>;

export function parentClass(
	kindHandler: Handler | string,
	parent?: DCommon.AnyConstructor,
): any {
	const formattedKindHandler = typeof kindHandler === "string"
		? create(kindHandler as never)
		: kindHandler;

	return class extends (parent ?? class {}) {
		public constructor(
			kindValue: unknown,
			...parentParams: unknown[]
		) {
			super(...parentParams);
			this[formattedKindHandler.runTimeKey] = kindValue;
		}

		public static override [Symbol.hasInstance] = parent
			? (input: unknown) => input instanceof parent && formattedKindHandler.has(input)
			: formattedKindHandler.has;
	};
}

import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type * as DDataStructure from "@scripts/dataStructure";
import { createKind } from "../kind";
import { type EntityStructure, type Entity } from "../entity";

export const flagKind = createKind<
	"flag",
	Record<string, unknown>
>("flag");

export interface Flag<
	GenericName extends string = string,
	GenericValue extends unknown = never,
> extends DKind.Kind<
		typeof flagKind,
		Record<GenericName, GenericValue>
	> {

}

const flagHandlerKind = createKind("flag-handler");

export interface FlagHandler<
	GenericName extends string = string,
	GenericEntity extends Entity = Entity,
	GenericValue extends unknown = unknown,
> extends DKind.Kind<typeof flagHandlerKind> {
	readonly name: GenericName;

	append<
		GenericInputEntity extends GenericEntity,
		const GenericInputValue extends GenericValue,
	>(
		value: GenericInputValue
	): (entity: GenericInputEntity) => (
		& GenericInputEntity
		& Flag<GenericName, GenericInputValue>
	);

	append<
		GenericInputEntity extends GenericEntity,
		const GenericInputValue extends GenericValue,
	>(
		entity: GenericInputEntity,
		value: GenericInputValue
	): (
		& GenericInputEntity
		& Flag<GenericName, GenericInputValue>
	);

	getValue<
		GenericInputEntity extends GenericEntity & Flag<GenericName, GenericValue>,
	>(
		entity: GenericInputEntity
	): DKind.GetValue<
		typeof flagKind,
		GenericInputEntity
	>[GenericName];

	has<
		GenericInputEntity extends GenericEntity,
	>(
		entity: GenericInputEntity
	): entity is Extract<
		GenericInputEntity,
		Flag<GenericName, any>
	>;
}

export function createFlag<
	GenericName extends Capitalize<string>,
	GenericEntityStructure extends EntityStructure,
	GenericPayload extends unknown = {},
>(
	name: DCommon.IsEqual<GenericName, Capitalize<string>> extends true
		? never
		: NoInfer<GenericName>,
): FlagHandler<
	GenericName,
	DDataStructure.StructureValue<GenericEntityStructure>,
	GenericPayload
> {
	function append(...args: [unknown] | [Entity, unknown]) {
		if (args.length === 1) {
			const [value] = args;
			return (entity: Entity) => append(entity, value);
		}

		const [entity, value] = args;
		const flagValue = flagKind.has(entity)
			? {
				...(flagKind.getValue(entity) as object),
				[name]: value,
			}
			: { [name]: value };

		return flagKind.addTo(
			entity,
			flagValue,
		);
	}

	return {
		name,
		append,
		getValue(entity: Entity) {
			return flagKind.getValue(entity as never)[name];
		},
		has(entity: Entity) {
			return flagKind.has(entity as never)
				&& name in flagKind.getValue(entity as never);
		},
		[flagHandlerKind.runTimeKey]: null,
	} satisfies Record<keyof DKind.Remove<FlagHandler>, unknown> as never;
}

export type GetFlag<
	GenericHandler extends FlagHandler<any, any, any>,
> = GenericHandler extends FlagHandler<
	infer InferredName,
	any,
	infer InferredValue
>
	? Flag<InferredName, InferredValue>
	: never;

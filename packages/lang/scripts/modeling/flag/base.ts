import type * as DKind from "@scripts/kind";
import type * as DDataStructure from "@scripts/dataStructure";
import { createKind } from "../kind";
import { type EntityStructure, type Entity } from "../entity";

export const flagKind = createKind<
	"flag",
	Record<string, unknown>
>("flag");

export interface Flag<
	GenericName extends Capitalize<string> = Capitalize<string>,
	GenericPayload extends unknown = unknown,
> extends DKind.Kind<
		typeof flagKind,
		Record<GenericName, GenericPayload>
	> {

}

export type GetFlagName<
	GenericFlag extends Flag,
> = GenericFlag extends Flag<
	infer InferredName extends Capitalize<string>
>
	? InferredName
	: never;

export type GetFlagPayload<
	GenericFlag extends Flag,
> = GenericFlag extends Flag<
	any,
	infer InferredPayload
>
	? InferredPayload
	: never;

const flagHandlerKind = createKind("flag-handler");

export interface FlagHandler<
	GenericName extends Capitalize<string> = Capitalize<string>,
	GenericEntity extends Entity = Entity,
	GenericPayload extends unknown = unknown> extends DKind.Kind<typeof flagHandlerKind> {
	readonly name: GenericName;

	append<
		GenericInputEntity extends GenericEntity,
		const GenericInputPayload extends GenericPayload,
	>(
		value: GenericInputPayload
	): (entity: GenericInputEntity) => (
		& GenericInputEntity
		& Flag<GenericName, GenericInputPayload>
	);

	append<
		GenericInputEntity extends GenericEntity,
		const GenericInputPayload extends GenericPayload,
	>(
		entity: GenericInputEntity,
		value: GenericInputPayload
	): (
		& GenericInputEntity
		& Flag<GenericName, GenericInputPayload>
	);

	getPayload<
		GenericInputEntity extends GenericEntity & Flag<GenericName, GenericPayload>,
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
	GenericFLag extends Flag,
	GenericEntityStructure extends EntityStructure,
>(
	name: GetFlagName<GenericFLag>,
): FlagHandler<
	GetFlagName<GenericFLag>,
	DDataStructure.StructureValue<GenericEntityStructure>,
	GetFlagPayload<GenericFLag>
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
		getPayload(entity: Entity) {
			return flagKind.getValue(entity as never)[name];
		},
		has(entity: Entity) {
			return flagKind.has(entity as never)
				&& name in flagKind.getValue(entity as never);
		},
		[flagHandlerKind.runTimeKey]: null,
	} satisfies Record<keyof DKind.Remove<FlagHandler>, unknown> as never;
}

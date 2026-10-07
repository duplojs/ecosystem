import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";
import { createKind } from "../kind";
import { type EntityStructure, type Entity } from "../entity";

export interface FactValue<
	GenericName extends string = string,
	GenericPayload extends unknown = unknown,
> {
	name: GenericName;
	payload: GenericPayload;
}

export const factKind = createKind<
	"fact",
	FactValue
>("fact");

export interface Fact<
	GenericName extends Capitalize<string> = Capitalize<string>,
	GenericValue extends unknown = unknown,
> extends DKind.Kind<
		typeof factKind,
		FactValue<GenericName, GenericValue>
	> {}

export type GetFactName<
	GenericHandler extends Fact,
> = GenericHandler extends Fact<
	infer InferredName extends Capitalize<string>
>
	? InferredName
	: never;

export type GetFactPayload<
	GenericHandler extends Fact,
> = GenericHandler extends Fact<
	any,
	infer InferredPayload extends object
>
	? InferredPayload
	: never;

export type FactRun<
	GenericName extends string = string,
> = DCommon.AnyFunction<
	any[],
	| DEither.Left
	| DEither.Right<
		`fact-result-${GenericName}`,
		unknown
	>
>;

const factHandlerKind = createKind("fact-handler");

export interface FactHandler<
	GenericName extends Capitalize<string> = Capitalize<string>,
	GenericEntity extends Entity = Entity,
	GenericPayload extends object = object,
	GenericRun extends FactRun<GenericName> = FactRun<GenericName>,
> extends DKind.Kind<typeof factHandlerKind> {
	readonly name: GenericName;

	run: GenericRun;

	getPayload<
		GenericInputEntity extends Fact<GenericName, GenericPayload>,
	>(
		entity: GenericInputEntity
	): DKind.GetValue<
		typeof factKind,
		GenericInputEntity
	>["payload"];

	has<
		GenericInputEntity extends GenericEntity,
	>(
		entity: GenericInputEntity
	): entity is Extract<
		GenericInputEntity,
		Fact<GenericName>
	>;
}

type RemoveFact<
	GenericEntity extends Entity,
> = GenericEntity extends Fact<infer InferredName, infer InferredValue>
	? GenericEntity extends (
		& infer InferredEntity
		& Fact<InferredName, InferredValue>
	)
		? InferredEntity
		: GenericEntity
	: GenericEntity;

export interface CreateFactConstructorParams<
	GenericName extends Capitalize<string> = Capitalize<string>,
	GenericEntity extends Entity = Entity,
	GenericPayload extends object = object,
> {
	applyFact<
		GenericInputEntity extends GenericEntity,
		GenericInputPayload extends GenericPayload,
	>(
		payload: GenericInputPayload
	): (
		entity: GenericInputEntity,
	) => DEither.Right<
		`fact-result-${GenericName}`,
		& RemoveFact<GenericInputEntity>
		& Fact<
			GenericName,
			GenericInputPayload
		>
	>;

	applyFact<
		GenericInputEntity extends GenericEntity,
		GenericInputPayload extends GenericPayload,
	>(
		entity: GenericInputEntity,
		payload: GenericInputPayload
	): DEither.Right<
		`fact-result-${GenericName}`,
		& RemoveFact<GenericInputEntity>
		& Fact<
			GenericName,
			GenericInputPayload
		>
	>;
}

export function createFact<
	GenericFact extends Fact,
	GenericEntityStructure extends EntityStructure,
>(
	name: GetFactName<GenericFact>,
): <
	GenericRun extends FactRun<GetFactName<GenericFact>>,
>(
	createRun: (
		params: CreateFactConstructorParams<
			GetFactName<GenericFact>,
			DDataStructure.StructureValue<
				GenericEntityStructure
			>,
			GetFactPayload<GenericFact>
		>,
	) => GenericRun,
) => FactHandler<
	GetFactName<GenericFact>,
	DDataStructure.StructureValue<
		GenericEntityStructure
	>,
	GetFactPayload<GenericFact>,
	GenericRun
> {
	function applyFact(...args: [Entity, unknown] | [unknown]) {
		if (args.length === 1) {
			const [payload] = args;
			return (entity: Entity) => applyFact(entity, payload);
		}
		const [entity, payload] = args;
		const entityWithFact = {
			...entity,
			[factKind.runTimeKey]: {
				name,
				payload,
			},
		} satisfies Entity;

		return DEither.right(
			`fact-result-${name}`,
			entityWithFact,
		);
	}

	return (createRun) => (
		{
			name,
			run: createRun({
				applyFact: applyFact as never,
			}),
			getPayload(entity: Entity & Fact) {
				return factKind.getValue(entity).payload;
			},
			has(entity: Entity & Fact) {
				return factKind.has(entity)
				&& factKind.getValue(entity).name === name;
			},
			[factHandlerKind.runTimeKey]: null,
		} satisfies Record<keyof DKind.Remove<FactHandler>, unknown> as never
	);
}

import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type * as DDataStructure from "@scripts/dataStructure";
import * as DEither from "@scripts/either";
import { createKind } from "../kind";
import { type EntityStructure, type Entity } from "../entity";
import type * as DObject from "@scripts/object";

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

export type FactSubscriber<
	GenericName extends Capitalize<string> = Capitalize<string>,
	GenericEntity extends Entity = Entity,
	GenericPayload extends object = object,
> = (
	entity: (
		& GenericEntity
		& Fact<GenericName, GenericPayload>
	),
	payload: GenericPayload,
) => DCommon.MaybePromise<
	| DEither.Right
	| DEither.Left
	| undefined
>;

export type FactSubscribers<
	GenericName extends Capitalize<string> = Capitalize<string>,
	GenericEntity extends Entity = Entity,
	GenericPayload extends object = object,
> = Record<
	string,
	FactSubscriber<
		GenericName,
		GenericEntity,
		GenericPayload
	>
>;

const factHandlerKind = createKind("fact-handler");

export interface FactHandler<
	GenericName extends Capitalize<string> = Capitalize<string>,
	GenericEntity extends Entity = Entity,
	GenericPayload extends object = object,
	GenericSubscribers extends FactSubscribers<GenericName, GenericEntity, GenericPayload> =
		FactSubscribers<GenericName, GenericEntity, GenericPayload>,
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

const factResolverKind = createKind("fact-resolver");

export interface FactResolver<
	GenericEntity extends Entity & Fact = Entity & Fact,
	GenericSubscribers extends Record<string, DCommon.AnyFunction> = Record<string, DCommon.AnyFunction>,
> extends DKind.Kind<typeof factResolverKind> {
	runAndResolve<
		GenericOutput extends DCommon.MaybePromise<
			| DEither.Right
			| DEither.Left
			| undefined
		>,
		const GenericWrapperSubscribers extends GenericSubscribers,
		GenericOutputHandlerLeft extends unknown = never,
	>(
		theFunction: (
			entity: GenericEntity,
			payload: DKind.GetValue<typeof factKind, GenericEntity>["payload"],
		) => GenericOutput,
		events: GenericWrapperSubscribers,
		...args: (
			DCommon.ContainExtends<
				Extract<
					| Awaited<GenericOutput>
					| Awaited<ReturnType<DObject.Values<GenericWrapperSubscribers>>>,
					DEither.Left
				>,
				DEither.Left
			> extends true
				? [
					whenLeft: (
						result: Extract<
							| Awaited<GenericOutput>
							| Awaited<ReturnType<DObject.Values<GenericWrapperSubscribers>>>,
							DEither.Left
						>,
						entity: GenericEntity,
						payload: DKind.GetValue<typeof factKind, GenericEntity>["payload"],
					) => GenericOutputHandlerLeft,
				]
				: []
		)
	): Promise<
		| (
			DCommon.IsNever<GenericOutputHandlerLeft> extends true
				? never
				: DEither.Left<"fact-resolve-error", Awaited<GenericOutputHandlerLeft>>
		)
		| DEither.Right<"fact-resolve-success", GenericEntity>
	>;

	resolve<
		const GenericWrapperSubscribers extends GenericSubscribers,
		GenericOutputHandlerLeft extends unknown = never,
	>(
		events: GenericWrapperSubscribers,
		...args: (
			DCommon.ContainExtends<
				Extract<
					Awaited<ReturnType<DObject.Values<GenericWrapperSubscribers>>>,
					DEither.Left
				>,
				DEither.Left
			> extends true
				? [
					whenLeft: (
						result: Extract<
							Awaited<ReturnType<DObject.Values<GenericWrapperSubscribers>>>,
							DEither.Left
						>,
						entity: GenericEntity,
						payload: DKind.GetValue<typeof factKind, GenericEntity>["payload"],
					) => GenericOutputHandlerLeft,
				]
				: []
		)
	): Promise<
		| (
			DCommon.IsNever<GenericOutputHandlerLeft> extends true
				? never
				: DEither.Left<"fact-resolve-error", Awaited<GenericOutputHandlerLeft>>
		)
		| DEither.Right<"fact-resolve-success", GenericEntity>
	>;
}

export interface CreateFactConstructorParams<
	GenericName extends Capitalize<string> = Capitalize<string>,
	GenericEntity extends Entity = Entity,
	GenericPayload extends object = object,
	GenericSubscribers extends FactSubscribers<GenericName, GenericEntity, GenericPayload> = FactSubscribers<
		GenericName,
		GenericEntity,
		GenericPayload
	>,
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
		DCommon.IsNever<GenericSubscribers> extends true
			? (
				& RemoveFact<GenericInputEntity>
				& Fact<
					GenericName,
					GenericInputPayload
				>
			)
			: FactResolver<
				& RemoveFact<GenericInputEntity>
				& Fact<
					GenericName,
					GenericInputPayload
				>,
				GenericSubscribers
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
		DCommon.IsNever<GenericSubscribers> extends true
			? (
				& RemoveFact<GenericInputEntity>
				& Fact<
					GenericName,
					GenericInputPayload
				>
			)
			: FactResolver<
				& RemoveFact<GenericInputEntity>
				& Fact<
					GenericName,
					GenericInputPayload
				>,
				GenericSubscribers
			>
	>;
}

export function createFact<
	GenericFact extends Fact,
	GenericEntityStructure extends EntityStructure,
	const GenericSubscribers extends (
		| FactSubscribers<
			GetFactName<GenericFact>,
			DDataStructure.StructureValue<GenericEntityStructure>,
			GetFactPayload<GenericFact>
		>
		| DCommon.AnyTuple<string>
	) = never,
	GenericFormattedSubscriber extends FactSubscribers<
		GetFactName<GenericFact>,
		DDataStructure.StructureValue<GenericEntityStructure>,
		GetFactPayload<GenericFact>
	> = GenericSubscribers extends readonly string[]
		? Record<
			GenericSubscribers[number],
			FactSubscriber<
				GetFactName<GenericFact>,
				DDataStructure.StructureValue<
					GenericEntityStructure
				>,
				GetFactPayload<GenericFact>
			>
		>
		: GenericSubscribers,
>(
	name: GetFactName<GenericFact>,
	...[hasEvent]: (
		DCommon.IsNever<GenericSubscribers> extends true
			? [hasEvent?: false]
			: [hasEvent: true]
	)
): <
	GenericRun extends FactRun<GetFactName<GenericFact>>,
>(
	createRun: (
		params: CreateFactConstructorParams<
			GetFactName<GenericFact>,
			DDataStructure.StructureValue<
				GenericEntityStructure
			>,
			GetFactPayload<GenericFact>,
			GenericFormattedSubscriber
		>,
	) => GenericRun,
) => FactHandler<
	GetFactName<GenericFact>,
	DDataStructure.StructureValue<
		GenericEntityStructure
	>,
	GetFactPayload<GenericFact>,
	GenericFormattedSubscriber,
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

		if (!hasEvent) {
			return DEither.right(
				`fact-result-${name}`,
				entityWithFact,
			);
		}

		function resolve(
			subscribers: Record<string, DCommon.AnyFunction>,
			whenError: DCommon.AnyFunction,
		) {
			return Promise
				.resolve()
				.then(
					() => Object
						.values(subscribers)
						.reduce(
							(accumulator, element) => DCommon.callThen(
								accumulator,
								(awaitedAccumulator) => {
									if (DEither.isLeft(awaitedAccumulator)) {
										return awaitedAccumulator;
									}
									return element(entityWithFact, payload);
								},
							),
							null,
						),
				)
				.then(
					(result) => {
						if (DEither.isLeft(result)) {
							return DCommon.callThen(
								whenError(result, entityWithFact, payload),
								(output) => DEither.left("fact-resolve-error", output),
							);
						}

						return DEither.right("fact-resolve-success", entityWithFact);
					},
				);
		}

		function runAndResolve(
			theFunction: DCommon.AnyFunction,
			subscribers: Record<string, DCommon.AnyFunction>,
			whenError: DCommon.AnyFunction,
		) {
			return Promise
				.resolve()
				.then(() => theFunction(entityWithFact, payload))
				.then(
					(result) => {
						if (DEither.isLeft(result)) {
							return DCommon.callThen(
								whenError(result, entityWithFact, payload),
								(output) => DEither.left("fact-resolve-error", output),
							);
						}

						return resolve(subscribers, whenError);
					},
				);
		}

		return DEither.right(
			`fact-result-${name}`,
			{
				resolve,
				runAndResolve,
				[factResolverKind.runTimeKey]: null,
			} satisfies Record<keyof DKind.Remove<FactResolver>, unknown> as never,
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

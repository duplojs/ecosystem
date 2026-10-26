import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { Client } from "../client";
import * as DPattern from "@duplojs/lang/pattern";
import * as DEither from "@duplojs/lang/either";
import { type CreateBookFact, type BookRentalFact, type ReturnBookFact } from "./facts";

export * from "./facts";

export namespace Book {
	const namespace = DModeling.createEntityNamespace("Book");

	export const Id = namespace.createNewType("Id", DDataStructure.string(), [DDataStructure.uuid()]);
	export type Id = DDataStructure.StructureValue<typeof Id>;

	export const Title = namespace.createNewType("Title", DDataStructure.string(), [
		DDataStructure.minCharacters(1),
		DDataStructure.maxCharacters(150),
	]);
	export type Title = DDataStructure.StructureValue<typeof Title>;

	export const AvailableState = DModeling.createTaggedObject(
		"AvailableState",
		{},
	);
	export type AvailableState = DDataStructure.StructureValue<typeof AvailableState>;

	export const BorrowedState = DModeling.createTaggedObject(
		"BorrowedState",
		{
			currentBorrowerId: Client.Id,
		},
	);
	export type BorrowedState = DDataStructure.StructureValue<typeof BorrowedState>;

	export const Entity = namespace.createEntity(() => ({
		id: Id,
		title: Title,
		state: DDataStructure.union([
			AvailableState,
			BorrowedState,
		]),
	}));
	export type Entity = DDataStructure.StructureValue<typeof Entity>;

	export type Facts = (
		| CreateBookFact
		| BookRentalFact
		| ReturnBookFact
	);

	export type AvailableFlag = DModeling.Flag<
		"Available",
		AvailableState
	>;
	const AvailableFlag = DModeling.createFlag<
		AvailableFlag,
		typeof Entity
	>("Available");

	export type BorrowedFlag = DModeling.Flag<
		"Borrowed",
		BorrowedState
	>;
	const BorrowedFlag = DModeling.createFlag<
		BorrowedFlag,
		typeof Entity
	>("Borrowed");

	export function refineState<
		GenericEntity extends Entity,
	>(entity: GenericEntity) {
		return DPattern.matchWithTaggedObject(
			entity.state,
			{
				AvailableState: (state) => DEither.result(
					"AvailableState",
					AvailableFlag.append(entity, state),
				),
				BorrowedState: (state) => DEither.result(
					"BorrowedState",
					BorrowedFlag.append(entity, state),
				),
			},
		);
	}
}

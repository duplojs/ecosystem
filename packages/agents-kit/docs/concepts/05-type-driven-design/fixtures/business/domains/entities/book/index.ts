import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import { Client } from "../client";
import * as DPattern from "@duplojs/lang/pattern";
import * as DEither from "@duplojs/lang/either";
import { type CreateBookFact, type BookRentalFact, type ReturnBookFact, type ReserveBookFact, type WithdrawBookFact } from "./facts";
import { WaitingListEntry } from "../waitingListEntry";

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

	export const ReservedState = DModeling.createTaggedObject("ReservedState", {
		waitingListEntryId: WaitingListEntry.Id,
	});
	export type ReservedState = DDataStructure.StructureValue<typeof ReservedState>;

	export const WithdrawnState = DModeling.createTaggedObject("WithdrawnState", {});
	export type WithdrawnState = DDataStructure.StructureValue<typeof WithdrawnState>;

	export const Entity = namespace.createEntity(() => ({
		id: Id,
		title: Title,
		state: DDataStructure.union([
			AvailableState,
			BorrowedState,
			ReservedState,
			WithdrawnState,
		]),
	}));
	export type Entity = DDataStructure.StructureValue<typeof Entity>;

	export type Facts = (
		| CreateBookFact
		| BookRentalFact
		| ReturnBookFact
		| ReserveBookFact
		| WithdrawBookFact
	);

	export const AvailableFlag = DModeling.createFlag<
		"Available",
		AvailableState,
		typeof Entity
	>("Available");
	export type AvailableFlag = DModeling.GetFlag<typeof AvailableFlag>;

	export const BorrowedFlag = DModeling.createFlag<
		"Borrowed",
		BorrowedState,
		typeof Entity
	>("Borrowed");
	export type BorrowedFlag = DModeling.GetFlag<typeof BorrowedFlag>;

	export const ReservedFlag = DModeling.createFlag<
		"Reserved",
		ReservedState,
		typeof Entity
	>("Reserved");
	export type ReservedFlag = DModeling.GetFlag<typeof ReservedFlag>;

	export const WithdrawnFlag = DModeling.createFlag<
		"Withdrawn",
		WithdrawnState,
		typeof Entity
	>("Withdrawn");
	export type WithdrawnFlag = DModeling.GetFlag<typeof WithdrawnFlag>;

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
				ReservedState: (state) => DEither.result(
					"ReservedState",
					ReservedFlag.append(entity, state),
				),
				WithdrawnState: (state) => DEither.result(
					"WithdrawnState",
					WithdrawnFlag.append(entity, state),
				),
			},
		);
	}
}

import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import * as DArray from "@duplojs/lang/array";
import * as DEither from "@duplojs/lang/either";
import { type ClientRentBookFact, type ClientGiveBackBook } from "./facts";
import { Book } from "../book";

export * from "./facts";

export namespace Client {
	const namespace = DModeling.createEntityNamespace("Client");

	export const Id = namespace.createNewType("Id", DDataStructure.string(), [DDataStructure.uuid()]);
	export type Id = DDataStructure.StructureValue<typeof Id>;

	export const Entity = namespace.createEntity(() => ({
		id: Id,
		borrowedBooks: DDataStructure.array(
			Book.Id,
			[DDataStructure.maxElements(5)],
		),
	}));
	export type Entity = DDataStructure.StructureValue<typeof Entity>;

	export type Facts = (
		| ClientRentBookFact
		| ClientGiveBackBook
	);

	export const CanRentBookFlag = DModeling.createFlag<
		"CanRentBook",
		readonly Book.Id[] & DArray.MaxElements<4>,
		typeof Entity
	>("CanRentBook");
	export type CanRentBookFlag = DModeling.GetFlag<typeof CanRentBookFlag>;

	export const NoBookRentalSlotsAvailableFlag = DModeling.createFlag<
		"NoBookRentalSlotsAvailable",
		undefined,
		typeof Entity
	>("NoBookRentalSlotsAvailable");
	export type NoBookRentalSlotsAvailableFlag = DModeling.GetFlag<typeof NoBookRentalSlotsAvailableFlag>;

	export function canRentBook<
		GenericEntity extends Entity,
	>(client: GenericEntity) {
		if (DArray.maxElements(client.borrowedBooks, 4)) {
			return DEither.result(
				"CanRentBook",
				CanRentBookFlag.append(client, client.borrowedBooks),
			);
		} else {
			return DEither.result(
				"NoBookRentalSlotsAvailable",
				NoBookRentalSlotsAvailableFlag.append(client, undefined),
			);
		}
	}
}

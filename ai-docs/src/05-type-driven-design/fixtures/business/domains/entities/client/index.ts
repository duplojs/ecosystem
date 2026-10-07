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

	export type CantRentBookFlag = DModeling.Flag<
		"CantRentBook",
		readonly Book.Id[] & DArray.MaxElements<4>
	>;
	export const CantRentBookFlag = DModeling.createFlag<
		CantRentBookFlag,
		typeof Entity
	>("CantRentBook");

	export type NoBookRentalSlotsAvailable = DModeling.Flag<
		"NoBookRentalSlotsAvailable",
		undefined
	>;
	export const NoBookRentalSlotsAvailable = DModeling.createFlag<
		NoBookRentalSlotsAvailable,
		typeof Entity
	>("NoBookRentalSlotsAvailable");

	export function cantRentBook<
		GenericEntity extends Entity,
	>(client: GenericEntity) {
		if (DArray.maxElements(client.borrowedBooks, 4)) {
			return CantRentBookFlag.append(client, client.borrowedBooks);
		} else {
			return NoBookRentalSlotsAvailable.append(client, undefined);
		}
	}

	export type HaveBookFlag = DModeling.Flag<
		"HaveBook",
		Book.Entity
	>;
	export const HaveBookFlag = DModeling.createFlag<
		HaveBookFlag,
		typeof Entity
	>("HaveBook");
	export function clientHaveBook(client: Entity, book: Book.Entity) {
		if (DArray.includes(client.borrowedBooks, book.id)) {
			return DEither.right(
				"client-have-book",
				HaveBookFlag.append(client, book),
			);
		}

		return DEither.left("client-not-have-book");
	}
}

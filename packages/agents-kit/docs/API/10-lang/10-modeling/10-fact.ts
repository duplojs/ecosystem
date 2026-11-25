/**
 * @title DModeling — Fact
 *
 * Définir les changements d'une entité et porter la trace du fait appliqué.
 */
import * as DModeling from "@duplojs/lang/modeling";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";

export namespace Book {
	const namespace = DModeling.createEntityNamespace("Book");
	export const Title = namespace.createNewType("Title", DDataStructure.string());
	export const BorrowerId = DModeling.createNewType("BorrowerId", DDataStructure.string());
	export type Title = DDataStructure.StructureValue<typeof Title>;
	export type BorrowerId = DDataStructure.StructureValue<typeof BorrowerId>;
	export const AvailableState = DModeling.createTaggedObject("Available", {});
	export const BorrowedState = DModeling.createTaggedObject("Borrowed", { borrowerId: BorrowerId });
	export type AvailableState = DDataStructure.StructureValue<typeof AvailableState>;
	export type BorrowedState = DDataStructure.StructureValue<typeof BorrowedState>;
	export const Entity = namespace.createEntity(() => ({
		title: Title,
		state: DDataStructure.union([AvailableState, BorrowedState]),
	}));
	export type Entity = DDataStructure.StructureValue<typeof Entity>;
	export const Available = DModeling.createFlag<"Available", AvailableState, typeof Entity>("Available");
	export type Available = DModeling.GetFlag<typeof Available>;
	export const Borrowed = DModeling.createFlag<"Borrowed", BorrowedState, typeof Entity>("Borrowed");
	export type Borrowed = DModeling.GetFlag<typeof Borrowed>;
}

// Un fait représente une création ou une mise à jour métier d'une entité.
// Ses paramètres exigent les conditions nécessaires ; sa payload décrit l'événement.
const RentBook = DModeling.createFact<"BookRented", { borrowerId: Book.BorrowerId }, typeof Book.Entity>("BookRented")(
	({ applyFact }) => (book: Book.Entity & Book.Available, borrowerId: Book.BorrowerId) => {
		const payload = { borrowerId };
		const state = Book.BorrowedState.new(payload);

		// update retire les anciennes preuves ; le fait établit le nouvel état,
		// puis applyFact associe sa trace et retourne un Right « fact-result-BookRented ».
		return DCommon.pipe(
			book,
			Book.Entity.update({ state }),
			Book.Borrowed.append(state),
			applyFact(payload),
		);
	},
);
type RentBook = DModeling.GetFact<typeof RentBook>;

declare const availableBook: Book.Entity & Book.Available;
declare const borrowerId: Book.BorrowerId;
const rentResult = RentBook.run(availableBook, borrowerId);
const rentedBook = DEither.unwrapRight(rentResult);
type _CheckRentedState = DCommon.ExpectType<
	typeof rentedBook.state,
	Book.BorrowedState,
	"strict"
>;
type _CheckRentResult = DCommon.ExpectType<
	typeof rentResult,
	DEither.Right<
		"fact-result-BookRented",
		DModeling.Entity<"Book"> & {
			readonly title: Book.Title;
			readonly state: Book.BorrowedState;
		} & Book.Borrowed & RentBook
	>,
	"strict"
>;
// @ts-expect-error Le livre emprunté ne porte plus la preuve qu'il est disponible.
RentBook.run(rentedBook, borrowerId);

// Une mise à jour reste un fait même lorsque l'état nommé ne change pas.
// Ici un livre emprunté change de titre et reste emprunté.
const RenameBorrowedBook = DModeling.createFact<
	"BorrowedBookRenamed",
	{
		previousTitle: Book.Title;
		title: Book.Title;
	},
	typeof Book.Entity
>("BorrowedBookRenamed")(
	({ applyFact }) => (book: Book.Entity & Book.Borrowed, title: Book.Title) => {
		const payload = {
			previousTitle: book.title,
			title,
		};
		const state = Book.Borrowed.getPayload(book);

		return DCommon.pipe(
			book,
			Book.Entity.update({ title }),
			Book.Borrowed.append(state),
			applyFact(payload),
		);
	},
);
type RenameBorrowedBook = DModeling.GetFact<typeof RenameBorrowedBook>;

declare const title: Book.Title;
const renameResult = RenameBorrowedBook.run(rentedBook, title);
const renamedBook = DEither.unwrapRight(renameResult);
type _CheckRenamed = DCommon.ExpectType<
	typeof renamedBook,
	Book.Entity & Book.Borrowed & RenameBorrowedBook,
	"strict"
>;
const renamePayload = RenameBorrowedBook.getPayload(renamedBook);
type _CheckPayload = DCommon.ExpectType<
	typeof renamePayload,
	{
		previousTitle: Book.Title;
		title: Book.Title;
	},
	"strict"
>;

// Une couche qui reçoit l'entité peut identifier le fait courant et lire sa payload.
declare const changedBook: (Book.Entity & RentBook) | (Book.Entity & RenameBorrowedBook);
if (RentBook.has(changedBook)) {
	type _CheckRentedBook = DCommon.ExpectType<
		typeof changedBook,
		Book.Entity & RentBook,
		"strict"
	>;
	const payload = RentBook.getPayload(changedBook);
	type _CheckRentPayload = DCommon.ExpectType<
		typeof payload,
		{ borrowerId: Book.BorrowerId },
		"strict"
	>;
}

// L'entité porte seulement le fait courant : un nouveau fait remplace le précédent.
// Pour construire un historique ou pratiquer l'event sourcing, une couche dédiée
// doit enregistrer chaque événement et sa payload au moment où elle les reçoit.

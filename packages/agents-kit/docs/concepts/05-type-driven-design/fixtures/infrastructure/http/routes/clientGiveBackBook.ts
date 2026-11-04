import { useRouteBuilder } from "@duplojs/http";
import * as DEither from "@duplojs/lang/either";
import { Book, Client, refineLinkBetweenClientAndBorrowedBook } from "../../../business/domains";
import { useCases } from "../../useCases";
import { iWantBookExist, iWantClientExist } from "../checkers";

export const clientGiveBackBookRoute = useRouteBuilder("POST", "/book-rentals/return")
	.extract({
		body: {
			clientId: Client.Id,
			bookId: Book.Id,
		},
	})
	.presetCheck(iWantClientExist.indexing("client"), ({ clientId }) => clientId)
	.presetCheck(iWantBookExist.indexing("book"), ({ bookId }) => bookId)
	.cut(
		({ book }, { response, output }) => DEither.matchInformation(
			Book.refineState(book),
			{
				BorrowedState: (book) => output({ book }),
				AvailableState: () => response.conflict("book.notBorrowed"),
				ReservedState: () => response.conflict("book.notBorrowed"),
				WithdrawnState: () => response.conflict("book.notBorrowed"),
			},
		),
	)
	.cut(
		({ client, book }, { response, output }) => DEither.matchInformation(
			refineLinkBetweenClientAndBorrowedBook(client, book),
			{
				"client-with-borrowed-book": (clientWithBorrowedBook) => output({ clientWithBorrowedBook }),
				"client-and-book-without-link": () => response.conflict("client.notHaveBook"),
			},
		),
	)
	.handler(
		async({ clientWithBorrowedBook }, { response }) => {
			const result = await useCases.clientGiveBackBookUseCase(clientWithBorrowedBook);

			return DEither.matchInformation(result, {
				"book-returned-without-waiting-list-entry": () => response.ok("book.returned", null),
				"book-returned-and-reserved": () => response.ok("book.returnedAndReserved", null),
				"waiting-list-selection-unavailable": () => response.serviceUnavailable("waiting-list.selectionUnavailable"),
			});
		},
	);

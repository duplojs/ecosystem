import { useRouteBuilder } from "@duplojs/http";
import * as DEither from "@duplojs/lang/either";
import { Book, Client } from "../../../business/domains";
import { useCases } from "../../useCases";
import { iWantBookExist, iWantClientExist } from "../checkers";

export const clientRentBookRoute = useRouteBuilder("POST", "/book-rentals")
	.extract({
		body: {
			clientId: Client.Id,
			bookId: Book.Id,
		},
	})
	.presetCheck(iWantClientExist.indexing("client"), ({ clientId }) => clientId)
	.presetCheck(iWantBookExist.indexing("book"), ({ bookId }) => bookId)
	.cut(
		({ client }, { response, output }) => DEither.matchInformation(
			Client.canRentBook(client),
			{
				CanRentBook: (client) => output({ client }),
				NoBookRentalSlotsAvailable: () => response.conflict("client.noBookRentalSlotsAvailable"),
			},
		),
	)
	.cut(
		({ book }, { response, output }) => DEither.matchInformation(
			Book.refineState(book),
			{
				AvailableState: (book) => output({ book }),
				BorrowedState: () => response.conflict("book.unavailable"),
			},
		),
	)
	.handler(
		async({ client, book }, { response }) => {
			const result = await useCases.clientRentBookUseCase({
				client,
				book,
			});

			return response.created("book.rented", DEither.unwrapRight(result));
		},
	);

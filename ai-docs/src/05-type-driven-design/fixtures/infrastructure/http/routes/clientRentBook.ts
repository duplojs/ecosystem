import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";
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
		ResponseContract.conflict("client.noBookRentalSlotsAvailable"),
		({ client }, { response, output }) => DEither.matchInformation(
			Client.cantRentBook(client),
			{
				CantRentBook: (client) => output({ client }),
				NoBookRentalSlotsAvailable: () => response("client.noBookRentalSlotsAvailable"),
			},
		),
	)
	.cut(
		ResponseContract.conflict("book.unavailable"),
		({ book }, { response, output }) => DEither.matchInformation(
			Book.refineState(book),
			{
				AvailableState: (book) => output({ book }),
				BorrowedState: () => response("book.unavailable"),
			},
		),
	)
	.handler(
		ResponseContract.created("book.rented", DDataStructure.object({
			client: Client.Entity,
			book: Book.Entity,
		})),
		async({ client, book }, { response }) => {
			const result = await useCases.clientRentBookUseCase({
				client,
				book,
			});

			return response("book.rented", DEither.unwrapRight(result));
		},
	);

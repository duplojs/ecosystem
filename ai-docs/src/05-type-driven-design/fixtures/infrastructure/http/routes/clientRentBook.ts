import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { Book, Client } from "../../../business/domains";
import { clientRentBookUseCase } from "../../useCases";
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
		[
			ResponseContract.conflict("client.noBookRentalSlotsAvailable"),
			ResponseContract.conflict("book.unavailable"),
		],
		({ client, book }, { response, output }) => {
			const clientWithFlag = Client.cantRentBook(client);
			if (!Client.CantRentBookFlag.has(clientWithFlag)) {
				return response("client.noBookRentalSlotsAvailable");
			}

			return DEither.matchInformation(Book.refineState(book), {
				AvailableState: (availableBook) => output({
					client: clientWithFlag,
					book: availableBook,
				}),
				BorrowedState: () => response("book.unavailable"),
			});
		},
	)
	.handler(
		ResponseContract.created("book.rented", DDataStructure.object({
			client: Client.Entity,
			book: Book.Entity,
		})),
		async({ client, book }, { response }) => {
			const result = await clientRentBookUseCase({
				client,
				book,
			});

			return response("book.rented", DEither.unwrapRight(result));
		},
	);

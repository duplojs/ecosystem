import { ResponseContract, useRouteBuilder } from "@duplojs/http";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DEither from "@duplojs/lang/either";
import { Book, Client } from "../../../business/domains";
import { clientGiveBackBookUseCase } from "../../useCases";
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
		ResponseContract.conflict("client.notHaveBook"),
		({ client, book }, { response, output }) => DEither.matchInformation(
			Client.clientHaveBook(client, book),
			{
				"client-have-book": (clientWithFlag) => output({ client: clientWithFlag }),
				"client-not-have-book": () => response("client.notHaveBook"),
			},
		),
	)
	.handler(
		ResponseContract.ok("book.returned", DDataStructure.object({
			client: Client.Entity,
			book: Book.Entity,
		})),
		async({ client }, { response }) => {
			const result = await clientGiveBackBookUseCase({ client });

			return response("book.returned", DEither.unwrapRight(result));
		},
	);

import * as DInvocation from "@duplojs/lang/invocation";
import { ClientGiveBackBook, ReturnBookFact, type Client } from "../entities";
import * as DEither from "@duplojs/lang/either";
import { type BookRepository } from "../repositories";

export function clientGiveBackBook(
	client: Client.Entity & Client.HaveBookFlag,
) {
	return DInvocation.createResolver({
		client: DEither.unwrapRight(ClientGiveBackBook.run(client)),
		book: DEither.unwrapRight(ReturnBookFact.run(client)),
	})<{
		rankBookAvailability: BookRepository["rankAvailability"];
	}>();
}

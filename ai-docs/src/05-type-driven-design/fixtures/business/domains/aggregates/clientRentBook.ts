import * as DInvocation from "@duplojs/lang/invocation";
import { BookRentalFact, ClientRentBookFact, type Book, type Client } from "../entities";
import * as DEither from "@duplojs/lang/either";
import { type EmailRepository } from "../repositories/email";

export function clientRentBook(
	client: Client.Entity & Client.CantRentBookFlag,
	book: Book.Entity & Book.AvailableFlag,
) {
	return DInvocation.createResolver({
		client: DEither.unwrapRight(ClientRentBookFact.run(client, book)),
		book: DEither.unwrapRight(BookRentalFact.run(client, book)),
	})<{
		sendInformationalEmail: EmailRepository["sendRentInformationalEmail"];
	}>();
}

import * as DInvocation from "@duplojs/lang/invocation";
import { type Book, type Client, clientRentBook } from "../../domains";
import * as DEither from "@duplojs/lang/either";
import { BookRepositoryPort, ClientRepositoryPort, EmailRepositoryPort } from "../ports";
import * as DCommon from "@duplojs/lang/common";

export const ClientRentBookUseCase = DInvocation.createReader(
	{
		BookRepositoryPort,
		ClientRepositoryPort,
		EmailRepositoryPort,
	},
	({
		bookRepository,
		clientRepository,
		emailRepository,
	}) => (
		params: {
			client: Client.Entity & Client.CantRentBookFlag;
			book: Book.Entity & Book.AvailableFlag;
		},
	) => DEither.rightAsyncPipe(
		clientRentBook(params.client, params.book),
		(resolver) => resolver.resolve({ sendInformationalEmail: emailRepository.sendRentInformationalEmail }),
		({ client, book }) => DCommon.promiseObject({
			client: clientRepository.save(client),
			book: bookRepository.save(book),
		}),
	),
);

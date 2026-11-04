import * as DInvocation from "@duplojs/lang/invocation";
import { type Book, type Client, clientRentBook } from "../../domains";
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
			client: Client.Entity & Client.CanRentBookFlag;
			book: Book.Entity & Book.AvailableFlag;
		},
	) => DInvocation.consumeWorkflow(
		clientRentBook(params),
		{
			"commit/book-and-client": ({ clientWithBorrowedBook, borrowedBook }) => DCommon.promiseObject({
				client: clientRepository.save(clientWithBorrowedBook),
				book: bookRepository.save(borrowedBook),
			}),
			"commit/send-informational-email": emailRepository.sendRentInformationalEmail,
		},
	),
);

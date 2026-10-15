import * as DInvocation from "@duplojs/lang/invocation";
import { type Client, clientGiveBackBook } from "../../domains";
import * as DEither from "@duplojs/lang/either";
import { BookRepositoryPort, ClientRepositoryPort } from "../ports";
import * as DCommon from "@duplojs/lang/common";

export const ClientGiveBackBookUseCase = DInvocation.createReader(
	{
		BookRepositoryPort,
		ClientRepositoryPort,
	},
	({
		bookRepository,
		clientRepository,
	}) => (
		params: {
			client: Client.Entity & Client.HaveBookFlag;
		},
	) => DEither.rightAsyncPipe(
		clientGiveBackBook(params.client),
		(resolver) => resolver.resolve({ rankBookAvailability: bookRepository.rankAvailability }),
		({ client, book }) => DCommon.promiseObject({
			client: clientRepository.save(client),
			book: bookRepository.save(book),
		}),
	),
);

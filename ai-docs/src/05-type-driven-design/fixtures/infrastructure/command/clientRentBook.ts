import * as DSCommand from "@duplojs/server/command";
import * as DEither from "@duplojs/lang/either";
import * as DCommon from "@duplojs/lang/common";
import { Book, Client } from "../../business/domains";
import { bookRepository, clientRepository } from "../ports";
import { useCases } from "../useCases";

export const clientRentBookCommand = DSCommand.create(
	"rent-book",
	{
		description: "Rent a book for a client",
		subjects: [
			DSCommand.createArgument("clientId", Client.Id),
			DSCommand.createArgument("bookId", Book.Id),
		],
	},
	async({ args: { clientId, bookId } }) => {
		const inputResult = await DEither.asyncGroup({
			client: async() => DEither.rewriteInformation(
				await DEither.rightAsyncPipe(
					clientRepository.findById(clientId),
					(client) => DCommon.asyncPipe(
						Client.canRentBook(client),
						DEither.keepAsRightByInformation("CanRentBook"),
					),
				),
				{ none: "client.notfound" },
			),
			book: async() => DEither.rewriteInformation(
				await DEither.rightAsyncPipe(
					bookRepository.findById(bookId),
					(book) => DCommon.asyncPipe(
						Book.refineState(book),
						DEither.keepAsRightByInformation("AvailableState"),
					),
				),
				{ none: "book.notfound" },
			),
		});

		if (
			DEither.isSelected(inputResult, {
				"book.notfound": true,
				"client.notfound": true,
				BorrowedState: true,
				NoBookRentalSlotsAvailable: true,
				success: false,
			})
		) {
			console.error(inputResult);
			return;
		}

		const result = await DCommon.pipe(
			inputResult,
			DEither.unwrapRight,
			useCases.clientRentBookUseCase,
		);

		console.log(JSON.stringify(result));
	},
);

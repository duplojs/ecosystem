import * as DEither from "@duplojs/lang/either";
import type * as DCommon from "@duplojs/lang/common";
import * as DInvocation from "@duplojs/lang/invocation";
import { Book, Client, refineLinkBetweenClientAndBorrowedBook } from "../../docs/concepts/05-type-driven-design/fixtures/business/domains";

const clientId = DEither.unwrapRightOrThrow(Client.Id.map("550e8400-e29b-41d4-a716-446655440001"));
const otherClientId = DEither.unwrapRightOrThrow(Client.Id.map("550e8400-e29b-41d4-a716-446655440002"));
const bookId = DEither.unwrapRightOrThrow(Book.Id.map("550e8400-e29b-41d4-a716-446655440003"));
const title = DEither.unwrapRightOrThrow(Book.Title.map("Example"));

describe("refineLinkBetweenClientAndBorrowedBook", () => {
	it.each([
		{
			borrowedBooks: [bookId],
			borrowerId: clientId,
			expectedInformation: "client-with-borrowed-book",
		},
		{
			borrowedBooks: [bookId],
			borrowerId: otherClientId,
			expectedInformation: "client-and-book-without-link",
		},
		{
			borrowedBooks: [],
			borrowerId: clientId,
			expectedInformation: "client-and-book-without-link",
		},
		{
			borrowedBooks: [],
			borrowerId: otherClientId,
			expectedInformation: "client-and-book-without-link",
		},
	] as const)("returns $expectedInformation for $borrowedBooks and $borrowerId", ({
		borrowedBooks,
		borrowerId,
		expectedInformation,
	}) => {
		const client = DEither.unwrapRightOrThrow(Client.Entity.map({
			id: clientId,
			borrowedBooks,
		}));
		const entity = Book.Entity.new({
			id: bookId,
			title,
			state: Book.BorrowedState.new({ currentBorrowerId: borrowerId }),
		});
		const book = DEither.unwrapByInformationOrThrow(Book.refineState(entity), "BorrowedState");
		const result = refineLinkBetweenClientAndBorrowedBook(client, book);

		expect(result).toStrictEqual(DInvocation.evidenceResult(expectedInformation, {
			client,
			book,
		}));

		interface Context {
			readonly client: Client.Entity;
			readonly book: Book.Entity & Book.BorrowedFlag;
		}
		type _CheckResult = DCommon.ExpectType<
			typeof result,
			| DInvocation.EvidenceResult<"client-with-borrowed-book", Context>
			| DInvocation.EvidenceResult<"client-and-book-without-link", Context>,
			"strict"
		>;
	});
});

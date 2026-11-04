import * as DInvocation from "@duplojs/lang/invocation";
import * as DGenerator from "@duplojs/lang/generator";
import { WaitingListEntryRepositoryPort } from "../../business/applications/ports";
import * as DEither from "@duplojs/lang/either";

export const waitingListEntryRepository = WaitingListEntryRepositoryPort.createImplementation({
	findNextPendingForBook: (book) => Promise.resolve(
		DInvocation.evidenceResult("no-pending-waiting-list-entry", {
			book,
			waitingListEntry: null,
		}),
	),
	findAllActiveByBook: DInvocation.withAdditionalResult((book) => true
		? DGenerator.asyncLoop(({ exit }) => exit())
		: Promise.resolve(DEither.left("waiting-list-stream-unavailable", book.id))),
	save: (entity) => Promise.resolve(entity),
});

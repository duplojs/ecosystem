import type * as DInvocation from "@duplojs/lang/invocation";
import { type Book, type WaitingListEntry } from "../entities";

export interface WaitingListEntryRepository {
	findNextPendingForBook(book: Book.Entity & Book.AvailableFlag): Promise<
		| DInvocation.EvidenceResult<"next-pending-waiting-list-entry", {
			book: Book.Entity & Book.AvailableFlag;
			waitingListEntry: WaitingListEntry.Entity & WaitingListEntry.PendingFlag;
		}>
		| DInvocation.EvidenceResult<"no-pending-waiting-list-entry", {
			book: Book.Entity & Book.AvailableFlag;
			waitingListEntry: null;
		}>
	>;
	findAllActiveByBook(book: Book.Entity & Book.WithdrawnFlag): AsyncGenerator<{
		book: Book.Entity & Book.WithdrawnFlag;
		waitingListEntry: WaitingListEntry.Entity & (WaitingListEntry.PendingFlag | WaitingListEntry.ReadyFlag);
	} & DInvocation.Evidence<"active-waiting-list-entry-for-withdrawn-book">>;
}

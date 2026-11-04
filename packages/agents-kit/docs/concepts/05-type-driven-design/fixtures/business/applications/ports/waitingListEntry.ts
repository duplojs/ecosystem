import * as DInvocation from "@duplojs/lang/invocation";
import type * as DEither from "@duplojs/lang/either";
import { type Book, type WaitingListEntry, type WaitingListEntryRepository } from "../../domains";

export interface WaitingListEntryRepositoryPort extends DInvocation.AddAdditionalResultOnMethods<
	WaitingListEntryRepository,
	{
		findNextPendingForBook: DEither.Left<"waiting-list-selection-unavailable", Book.Id>;
		findAllActiveByBook: DEither.Left<"waiting-list-stream-unavailable", Book.Id>;
	}
> {
	save<
		GenericEntity extends WaitingListEntry.Entity & WaitingListEntry.Facts,
	>(entity: GenericEntity): Promise<GenericEntity>;
}

export const WaitingListEntryRepositoryPort = DInvocation.createPort<WaitingListEntryRepositoryPort>();

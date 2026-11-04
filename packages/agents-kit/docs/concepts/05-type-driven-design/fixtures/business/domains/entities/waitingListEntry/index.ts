import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DModeling from "@duplojs/lang/modeling";
import * as DPattern from "@duplojs/lang/pattern";
import * as DEither from "@duplojs/lang/either";
import { Book } from "../book";
import { Client } from "../client";
import { type CreateWaitingListEntryFact, type PrepareWaitingListEntryFact, type CancelWaitingListEntryFact } from "./facts";

export * from "./facts";

export namespace WaitingListEntry {
	const namespace = DModeling.createEntityNamespace("WaitingListEntry");

	export const Id = namespace.createNewType("Id", DDataStructure.string(), [DDataStructure.uuid()]);
	export type Id = DDataStructure.StructureValue<typeof Id>;

	export const RequestedAt = namespace.createNewType("RequestedAt", DDataStructure.date());
	export type RequestedAt = DDataStructure.StructureValue<typeof RequestedAt>;

	export const PendingState = DModeling.createTaggedObject("PendingWaitingListEntryState", {});
	export type PendingState = DDataStructure.StructureValue<typeof PendingState>;

	export const ReadyState = DModeling.createTaggedObject("ReadyWaitingListEntryState", {});
	export type ReadyState = DDataStructure.StructureValue<typeof ReadyState>;

	export const CancelledState = DModeling.createTaggedObject("CancelledWaitingListEntryState", {
		reason: DDataStructure.literal(["book-withdrawn", "client-cancelled"]),
	});
	export type CancelledState = DDataStructure.StructureValue<typeof CancelledState>;

	export const Entity = namespace.createEntity(() => ({
		id: Id,
		bookId: Book.Id,
		clientId: Client.Id,
		requestedAt: RequestedAt,
		state: DDataStructure.union([PendingState, ReadyState, CancelledState]),
	}));
	export type Entity = DDataStructure.StructureValue<typeof Entity>;

	export type Facts = CreateWaitingListEntryFact | PrepareWaitingListEntryFact | CancelWaitingListEntryFact;

	export const PendingFlag = DModeling.createFlag<
		"PendingWaitingListEntry",
		PendingState,
		typeof Entity
	>("PendingWaitingListEntry");
	export type PendingFlag = DModeling.GetFlag<typeof PendingFlag>;

	export const ReadyFlag = DModeling.createFlag<
		"ReadyWaitingListEntry",
		ReadyState,
		typeof Entity
	>("ReadyWaitingListEntry");
	export type ReadyFlag = DModeling.GetFlag<typeof ReadyFlag>;

	export const CancelledFlag = DModeling.createFlag<
		"CancelledWaitingListEntry",
		CancelledState,
		typeof Entity
	>("CancelledWaitingListEntry");
	export type CancelledFlag = DModeling.GetFlag<typeof CancelledFlag>;

	export function refineState<GenericEntity extends Entity>(waitingListEntry: GenericEntity) {
		return DPattern.matchWithTaggedObject(waitingListEntry.state, {
			PendingWaitingListEntryState: (state) => DEither.result(
				"PendingWaitingListEntry",
				PendingFlag.append(waitingListEntry, state),
			),
			ReadyWaitingListEntryState: (state) => DEither.result(
				"ReadyWaitingListEntry",
				ReadyFlag.append(waitingListEntry, state),
			),
			CancelledWaitingListEntryState: (state) => DEither.result(
				"CancelledWaitingListEntry",
				CancelledFlag.append(waitingListEntry, state),
			),
		});
	}
}

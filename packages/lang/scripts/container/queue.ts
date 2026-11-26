import * as DCommon from "@scripts/common";
import * as DEither from "@scripts/either";
import type * as DKind from "@scripts/kind";
import { createKind } from "./kind";
import { createCircularDoublyLinkedList } from "./circularDoublyLinkedList";

export const queueKind = createKind("queue");

export interface Queue extends DKind.Kind<typeof queueKind> {
	readonly inRunning: number;
	readonly concurrency: number;
	add<
		GenericOutput extends unknown,
	>(
		task: () => GenericOutput,
	): Promise<
		| Awaited<GenericOutput>
		| DEither.Left<"execution-error", unknown>
	>;

	addExternal(): Promise<
		() => void
	>;
}

export interface CreateQueueParams {
	concurrency?: number;
}

class _Queue implements Record<
	keyof DKind.Remove<Queue>,
	unknown
> {
	public concurrency: number;

	public inRunning = 0;

	private tasks = createCircularDoublyLinkedList<() => void>();

	public constructor(params?: CreateQueueParams) {
		this.concurrency = params?.concurrency === undefined || params.concurrency < 1
			? 1
			: params.concurrency;
	}

	public add(
		task: () => unknown,
	) {
		const externalPromise = DCommon.createExternalPromise();
		const preparedTask = () => {
			this.inRunning++;

			DCommon.callThen(
				() => task(),
				(output) => {
					externalPromise.resolve(output);
					this.inRunning--;
					this.tasks.shift()?.();
				},
				(error) => {
					externalPromise.resolve(DEither.left("execution-error", error));
					this.inRunning--;
					this.tasks.shift()?.();
				},
			);
		};

		if (this.inRunning < this.concurrency) {
			void preparedTask();
		} else {
			this.tasks.add(preparedTask);
		}

		return externalPromise.promise;
	}

	public addExternal() {
		const externalPromiseToStart = DCommon.createExternalPromise<() => void>();
		const externalPromiseToFinish = DCommon.createExternalPromise<never>();

		void this.add(
			() => {
				externalPromiseToStart.resolve(
					externalPromiseToFinish.resolve as never,
				);

				return externalPromiseToFinish.promise;
			},
		);

		return externalPromiseToStart.promise;
	}

	public [queueKind.runTimeKey] = null;
}

export function createQueue(params?: CreateQueueParams): Queue {
	return new _Queue(params) as never;
}

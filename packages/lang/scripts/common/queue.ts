import { callThen } from "./callThen";
import { createExternalPromise } from "./externalPromise";
import * as DEither from "@scripts/either";
import type * as DKind from "@scripts/kind";
import { createKind } from "./kind";
import * as DContainer from "@scripts/container";

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

	private tasks = DContainer.createCircularDoublyLinkedList<() => void>();

	public constructor(params?: CreateQueueParams) {
		this.concurrency = params?.concurrency === undefined || params.concurrency < 1
			? 1
			: params.concurrency;
	}

	public add(
		task: () => unknown,
	) {
		const externalPromise = createExternalPromise();
		const preparedTask = () => {
			this.inRunning++;

			callThen(
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
		const externalPromiseToStart = createExternalPromise<() => void>();
		const externalPromiseToFinish = createExternalPromise<never>();

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

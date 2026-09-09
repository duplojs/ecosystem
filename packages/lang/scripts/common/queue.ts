import { callThen } from "./callThen";
import { createExternalPromise } from "./externalPromise";
import * as DEither from "@scripts/either";
import type * as DKind from "@scripts/kind";
import { createKind } from "./kind";
import type { MaybePromise } from "./types";

export const queueKind = createKind("queue");

export interface Queue extends DKind.Kind<typeof queueKind> {
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

interface QueueElement {
	task(): MaybePromise<unknown>;
	next: QueueElement;
	previous: QueueElement;
}

export interface CreateQueueParams {
	concurrency?: number;
}

export function createQueue(params?: CreateQueueParams): Queue;

export function createQueue(params?: CreateQueueParams): Queue {
	const concurrency = params?.concurrency === undefined || params.concurrency < 1
		? 1
		: params.concurrency;
	let runningCount = 0;
	let firstElement: QueueElement | undefined = undefined;

	function add(
		task: () => unknown,
	) {
		const externalPromise = createExternalPromise();
		const preparedTask = () => {
			runningCount++;

			if (firstElement?.task === preparedTask) {
				if (firstElement === firstElement.next) {
					firstElement = undefined;
				} else {
					const newFirst = firstElement.next;
					const last = firstElement.previous;
					newFirst.previous = last;
					last.next = newFirst;

					firstElement = newFirst;
				}
			}

			let taskResult: unknown = undefined;
			try {
				const maybePromise = task();

				taskResult = maybePromise instanceof Promise
					? maybePromise.catch(
						(error) => DEither.left("execution-error", error),
					)
					: maybePromise;
			} catch (error) {
				taskResult = DEither.left("execution-error", error);
			}

			callThen(
				taskResult,
				(output) => {
					externalPromise.resolve(output);
					runningCount--;
					firstElement?.task();
				},
			);
		};

		if (runningCount < concurrency) {
			void preparedTask();
		} else if (firstElement === undefined) {
			firstElement = {
				task: preparedTask,
				next: undefined as unknown as QueueElement,
				previous: undefined as unknown as QueueElement,
			};
			firstElement.next = firstElement;
			firstElement.previous = firstElement;
		} else {
			const oldLast = firstElement.previous;
			const newLastElement = {
				task: preparedTask,
				next: firstElement,
				previous: firstElement.previous,
			};

			oldLast.next = newLastElement;
			firstElement.previous = newLastElement;
		}

		return externalPromise.promise;
	}

	function addExternal() {
		const externalPromiseToStart = createExternalPromise<() => void>();
		const externalPromiseToFinish = createExternalPromise<never>();

		void add(
			() => {
				externalPromiseToStart.resolve(
					externalPromiseToFinish.resolve as never,
				);

				return externalPromiseToFinish.promise;
			},
		);

		return externalPromiseToStart.promise;
	}

	return queueKind.setTo(
		{
			add,
			addExternal,
		} satisfies Record<keyof DKind.Remove<Queue>, unknown>,
		undefined,
	) as never;
}

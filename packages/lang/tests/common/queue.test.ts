import { DCommon, DEither, type EscapeVoid, type ExpectType } from "@scripts";

describe("queue", () => {
	it("executes queued tasks in FIFO order with concurrency one", async() => {
		const queue = DCommon.createQueue({ concurrency: 1 });
		const blocker = DCommon.createExternalPromise<EscapeVoid>();
		const order: string[] = [];

		const firstTask = queue.add(() => {
			order.push("first-start");

			return blocker.promise.then(() => {
				order.push("first-end");

				return "first" as const;
			});
		});
		const secondTask = queue.add(() => {
			order.push("second");

			return "second" as const;
		});
		const thirdTask = queue.add(() => {
			order.push("third");

			return "third" as const;
		});

		await Promise.resolve();
		expect(order).toStrictEqual(["first-start"]);

		blocker.resolve();

		await expect(firstTask).resolves.toBe("first");
		await expect(secondTask).resolves.toBe("second");
		await expect(thirdTask).resolves.toBe("third");
		expect(order).toStrictEqual(["first-start", "first-end", "second", "third"]);

		type _CheckSecondTask = ExpectType<
			typeof secondTask,
			Promise<
				| "second"
				| DEither.Left<"execution-error", unknown>
			>,
			"strict"
		>;
	});

	it("falls back to concurrency one when concurrency is lower than one", async() => {
		const queue = DCommon.createQueue({ concurrency: 0 });
		const blocker = DCommon.createExternalPromise<EscapeVoid>();
		let secondStarted = false;

		const firstTask = queue.add(() => blocker.promise.then(() => 1 as const));
		const secondTask = queue.add(() => {
			secondStarted = true;

			return 2 as const;
		});

		await Promise.resolve();
		expect(secondStarted).toBe(false);

		blocker.resolve();

		await expect(firstTask).resolves.toBe(1);
		await expect(secondTask).resolves.toBe(2);
	});

	it("wraps thrown and rejected errors in a left", async() => {
		const queue = DCommon.createQueue();
		const syncError = new Error("sync");
		const asyncError = new Error("async");

		await expect(queue.add(() => {
			throw syncError;
		})).resolves.toStrictEqual(DEither.left("execution-error", syncError));
		await expect(queue.add(() => Promise.reject(asyncError))).resolves.toStrictEqual(
			DEither.left("execution-error", asyncError),
		);
	});

	it("reserves a slot with addExternal until the resolver is called", async() => {
		const queue = DCommon.createQueue({ concurrency: 1 });
		const order: string[] = [];
		const releasePromise = queue.addExternal();
		const queuedTask = queue.add(() => {
			order.push("queued");

			return "queued" as const;
		});

		const release = await releasePromise;
		await Promise.resolve();
		expect(order).toStrictEqual([]);

		release();

		await expect(queuedTask).resolves.toBe("queued");
		expect(order).toStrictEqual(["queued"]);
	});
});

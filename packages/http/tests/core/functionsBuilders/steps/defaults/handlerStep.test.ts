import { createHandlerStep, PredictedResponse, type HandlerStepDefinition, type ServerSentEvents, type Stream } from "@core";
import { createTestRequest } from "@test-utils/createTestRequest";
import { useTestStepFunctionBuilder } from "@test-utils/useTestStepFunctionBuilder";

describe("handler step function builder", () => {
	async function build(theFunction: HandlerStepDefinition["theFunction"]) {
		return useTestStepFunctionBuilder(createHandlerStep({
			theFunction,
			metadata: [],
		}));
	}

	it("passes the floor and request and preserves the returned response", async() => {
		const request = createTestRequest();
		const floor = {
			value: {
				id: 42,
				extra: "preserved",
			},
		};
		const built = await build((input, { response, request: receivedRequest }) => {
			expect(input).toBe(floor);
			expect(receivedRequest).toBe(request);
			return response.ok("inferred", floor.value).setHeader("x-test", "kept");
		});
		const result = await built.buildedFunction(request, floor);
		expect(result).toStrictEqual(new PredictedResponse("200", "inferred", floor.value).setHeader("x-test", "kept"));
		expect(result.body).toBe(floor.value);
		expect(built.hooksRouteLifeCycle).toStrictEqual([]);
	});

	it("awaits an asynchronous response", async() => {
		const expected = new PredictedResponse("201", "created", { id: 42 });
		const built = await build(() => Promise.resolve(expected));
		expect(await built.buildedFunction(createTestRequest(), {})).toBe(expected);
	});

	it("preserves the SSE callback and sends declared events directly", async() => {
		const send = vi.fn(() => Promise.resolve());
		const onStart = async(params: ServerSentEvents.StartSendingParams<{
			message: string;
			ping: { id: number };
		}>) => {
			await params.send("ping", { id: 42 });
			await params.send("message", "hello", { id: "2" });
		};
		const built = await build(
			(floor, { response }) => response.serverSentEvents(
				"events",
			).onStart<string, { ping: { id: number } }>(
				onStart,
			),
		);
		const result = await built.buildedFunction(createTestRequest(), {});
		expect(result).toHaveProperty("startSendingEvents", onStart);
		await onStart({ send } as never);
		expect(send).toHaveBeenNthCalledWith(1, "ping", { id: 42 });
		expect(send).toHaveBeenNthCalledWith(2, "message", "hello", { id: "2" });
	});

	it("preserves the stream callback without preparing or validating chunks", async() => {
		const send = vi.fn(() => Promise.resolve());
		const chunk = {
			value: 42,
			extra: true,
		};
		const onStart = async(params: Stream.StartSendingParams<typeof chunk>) => {
			await params.send(chunk);
		};
		const built = await build((floor, { response }) => response.stream("binary").onStart(onStart));
		const result = await built.buildedFunction(createTestRequest(), {});
		expect(result).toHaveProperty("startStream", onStart);
		await onStart({ send } as never);
		expect(send).toHaveBeenCalledExactlyOnceWith(chunk);
	});

	it("preserves the text stream callback", async() => {
		const send = vi.fn(() => Promise.resolve());
		const onStart = async(params: Stream.StartSendingParams<string>) => {
			await params.send("first", "second");
		};
		const built = await build((floor, { response }) => response.streamText("text").onStart(onStart));
		const result = await built.buildedFunction(createTestRequest(), {});
		expect(result).toHaveProperty("startStream", onStart);
		await onStart({ send } as never);
		expect(send).toHaveBeenCalledExactlyOnceWith("first", "second");
	});
});

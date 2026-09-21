import { bodyResultKind, createKind, Request } from "@core";
import * as DKind from "@duplojs/lang/kind";
import * as DEither from "@duplojs/lang/either";
import { createBodyReader } from "@test-utils/bodyReader";

describe("Request", () => {
	it("construct", () => {
		const bodyReader = createBodyReader();
		expect({
			...new Request({
				method: "GET",
				headers: { host: "example.com" },
				url: "https://example.com/path?query=1",
				host: "example.com",
				origin: "https://example.com",
				matchedPath: null,
				params: {},
				path: "/path",
				query: { query: "1" },
				bodyReader,
				...({
					test: "value",
				}),
			}),
		}).toStrictEqual({
			"@duplojs/lang/kind/@DuplojsHttpCore/request": null,
			method: "GET",
			headers: { host: "example.com" },
			url: "https://example.com/path?query=1",
			host: "example.com",
			origin: "https://example.com",
			matchedPath: null,
			params: {},
			path: "/path",
			query: { query: "1" },
			bodyReader,
			test: "value",
			bodyResult: undefined,
			filesAttache: undefined,
		});
	});

	it("multi instance", () => {
		class CloneRequest extends DKind.parentClass(
			createKind("request"),
		) {}

		expect((new CloneRequest(null)) instanceof Request).toBe(true);
		expect((new Request({} as any)) instanceof CloneRequest).toBe(true);
	});

	it("getBodyResult", () => {
		const spy = vi.fn(() => "superBody");
		const bodyRequest = new Request({
			method: "GET",
			headers: { host: "example.com" },
			url: "https://example.com/path?query=1",
			host: "example.com",
			origin: "https://example.com",
			matchedPath: null,
			params: {},
			path: "/path",
			query: { query: "1" },
			bodyReader: createBodyReader(spy),
		});

		const bodyResult = bodyRequest.getBodyResult();
		void bodyRequest.getBodyResult();
		void bodyRequest.getBodyResult();
		expect(bodyRequest.getBodyResult()).toStrictEqual(
			expect.objectContaining({ [bodyResultKind.runTimeKey]: null }),
		);
		expect(bodyResult).toStrictEqual(
			expect.objectContaining({ [bodyResultKind.runTimeKey]: null }),
		);
		expect(bodyRequest.getBodyResult()).toBe(bodyResult);
		expect(spy).toHaveBeenCalledTimes(1);
	});
});

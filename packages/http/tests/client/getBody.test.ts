import { getBody } from "@client";

describe("getBody", () => {
	it("returns undefined when content-type is missing", async() => {
		const response = {
			headers: new Headers(),
		} as Response;

		await expect(getBody(response)).resolves.toBeUndefined();
	});

	it("parses json when content-type includes json", async() => {
		const json = vi.fn().mockResolvedValue({ ok: true });
		const response = {
			headers: new Headers({ "content-type": "application/json; charset=utf-8" }),
			json,
		} as unknown as Response;

		await expect(getBody(response)).resolves.toStrictEqual({ ok: true });
		expect(json).toHaveBeenCalledTimes(1);
	});

	it("parses text when content-type includes text", async() => {
		const text = vi.fn().mockResolvedValue("hello");
		const response = {
			headers: new Headers({ "content-type": "text/plain" }),
			text,
		} as unknown as Response;

		await expect(getBody(response)).resolves.toBe("hello");
		expect(text).toHaveBeenCalledTimes(1);
	});

	it("returns undefined for unsupported content-types", async() => {
		const response = {
			headers: new Headers({ "content-type": "application/octet-stream" }),
		} as unknown as Response;

		await expect(getBody(response)).resolves.toBe(undefined);
	});

	it.each([
		{
			contentType: "text/plain",
			disposition: "attachment; filename=\"download.txt\"",
		},
		{
			contentType: "application/json",
			disposition: "attachment; filename=\"download.json\"",
		},
		{
			contentType: "application/octet-stream",
			disposition: "attachment; filename=\"download.bin\"",
		},
		{
			contentType: "text/plain",
			disposition: "attachment",
		},
		{
			contentType: "text/plain",
			disposition: "ATTACHMENT; filename=\"download.txt\"",
		},
		{
			contentType: "text/plain",
			disposition: "attachment ; filename=\"download.txt\"",
		},
	])("preserves the raw body for $contentType with $disposition", async({ contentType, disposition }) => {
		const response = new Response("download contents", {
			headers: {
				"content-type": contentType,
				"content-disposition": disposition,
			},
		});

		await expect(getBody(response)).resolves.toBeUndefined();
		expect(response.bodyUsed).toBe(false);
		await expect(response.text()).resolves.toBe("download contents");
	});

	it("reads inline text even when its filename contains attachment", async() => {
		const response = new Response("inline contents", {
			headers: {
				"content-type": "text/plain",
				"content-disposition": "inline; filename=\"attachment.txt\"",
			},
		});

		await expect(getBody(response)).resolves.toBe("inline contents");
		expect(response.bodyUsed).toBe(true);
	});
});

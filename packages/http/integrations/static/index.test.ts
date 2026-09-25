// oxlint-disable-next-line duplojs-plugin/no-restricted-import
import { TESTImplementation, setEnvironment } from "@duplojs/server";
import type * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import * as DChrono from "@duplojs/lang/chrono";
import { createHttpServer } from "@duplojs/http/node";

import { hub } from "@core";

describe("static plugin", async() => {
	const mockedModifiedAt = DChrono.createDate("2026-03-02");

	setEnvironment("TEST");

	TESTImplementation.set("stat", async(path: string) => {
		await Promise.resolve();

		if (path === "files/fakeFiles") {
			return DEither.right(
				"file-system-stat",
				{
					isFile: false,
					isDirectory: true,
					modifiedAt: null,
				} as DSFile.StatInfo,
			);
		}

		if (path === "files/fakeFiles/superTextFile.txt") {
			return DEither.right(
				"file-system-stat",
				{
					isFile: true,
					isDirectory: false,
					modifiedAt: mockedModifiedAt,
				} as DSFile.StatInfo,
			);
		}

		if (path === "files/fakeFiles/1mb.jpg") {
			return DEither.right(
				"file-system-stat",
				{
					isFile: true,
					isDirectory: false,
					modifiedAt: mockedModifiedAt,
				} as DSFile.StatInfo,
			);
		}

		return DEither.left("file-system-stat-error");
	});

	const server = await createHttpServer(hub, {
		host: "0.0.0.0",
		port: 8980,
	});

	afterAll(() => {
		TESTImplementation.clear();
		server.close();
	});

	it("file found", async() => {
		await expect(
			fetch("http://localhost:8980/static-file", {
				method: "GET",
			})
				.then(async(response) => ({
					body: await response.text(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			body: "this is super file with super content.",
			headers: expect.arrayContaining([
				[
					"information",
					"resource.found",
				],
				[
					"content-type",
					"text/plain",
				],
				[
					"last-modified",
					mockedModifiedAt.toISOString(),
				],
				[
					"content-disposition",
					"attachment; filename=\"superTextFile.txt\"",
				],
			]),
		});
	});

	it("file notModified", async() => {
		await expect(
			fetch("http://localhost:8980/static-file", {
				method: "GET",
				headers: {
					"if-modified-since": mockedModifiedAt.toISOString(),
				},
			})
				.then(async(response) => ({
					code: response.status,
					body: await response.text(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			body: "",
			code: 304,
			headers: expect.arrayContaining([
				[
					"information",
					"resource.notModified",
				],
				[
					"last-modified",
					mockedModifiedAt.toISOString(),
				],
			]),
		});
	});

	it("file in folder found", async() => {
		await expect(
			fetch("http://localhost:8980/static-folder/superTextFile.txt", {
				method: "GET",
			})
				.then(async(response) => ({
					body: await response.text(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			body: "this is super file with super content.",
			headers: expect.arrayContaining([
				[
					"information",
					"resource.found",
				],
				[
					"content-type",
					"text/plain",
				],
				[
					"last-modified",
					mockedModifiedAt.toISOString(),
				],
				[
					"content-disposition",
					"attachment; filename=\"superTextFile.txt\"",
				],
			]),
		});
	});

	it("file in folder notModified", async() => {
		await expect(
			fetch("http://localhost:8980/static-folder/superTextFile.txt", {
				method: "GET",
				headers: {
					"if-modified-since": mockedModifiedAt.toISOString(),
				},
			})
				.then(async(response) => ({
					code: response.status,
					body: await response.text(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			body: "",
			code: 304,
			headers: expect.arrayContaining([
				[
					"information",
					"resource.notModified",
				],
				[
					"last-modified",
					mockedModifiedAt.toISOString(),
				],
			]),
		});
	});

	it("file in folder notfound", async() => {
		await expect(
			fetch("http://localhost:8980/static-folder/unknown.txt", {
				method: "GET",
			})
				.then(async(response) => ({
					code: response.status,
					body: await response.text(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			body: "",
			code: 404,
			headers: expect.arrayContaining([
				[
					"information",
					"resource.notfound",
				],
			]),
		});
	});

	it("default file in folder", async() => {
		await expect(
			fetch("http://localhost:8980/static-folder/", {
				method: "GET",
			})
				.then((response) => ({
					code: response.status,
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			code: 200,
			headers: expect.arrayContaining([
				[
					"information",
					"resource.found",
				],
				[
					"last-modified",
					mockedModifiedAt.toISOString(),
				],
				[
					"content-type",
					"image/jpeg",
				],
				[
					"content-disposition",
					"attachment; filename=\"1mb.jpg\"",
				],
			]),
		});
	});
});

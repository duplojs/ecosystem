import { hub } from "@core";
import { createHttpServer } from "@duplojs/http/node";
import * as DSFile from "@duplojs/server/file";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import { createFileToSend } from "@utils";
import * as DPath from "@duplojs/lang/path";

describe("file", async() => {
	const server = await createHttpServer(hub, {
		host: "0.0.0.0",
		port: 8961,
		uploadFolder: DPath.resolveRelative([DPath.createOrThrow(import.meta.dirname), DCommon.cast("../files/upload")]),
	});

	afterAll(() => {
		server.close();
	});

	it("send File", async() => {
		const formData = new FormData();
		formData.append("bool", "true");
		formData.append("name", "node/nodeTest.generate");
		formData.append(
			"myFile/*\\[0]",
			await createFileToSend(DCommon.cast("files/fakeFiles/1mb.jpg"), "😄.jpg"),
		);

		await expect(
			fetch("http://localhost:8961/documents", {
				method: "POST",
				body: formData,
				headers: { "x-duplojs-body-options": "advanced" },
			})
				.then((response) => ({
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			headers: expect.arrayContaining([
				[
					"information",
					"file.receive",
				],
			]),
		});

		await DCommon.timeout(500);

		expect(
			await DSFile.stat(DPath.declarePath("files/store/node/nodeTest.generate.jpg")),
		).toStrictEqual(
			DEither.success(
				expect.objectContaining({ sizeBytes: DCommon.stringToBytes("1mb") }),
			),
		);
		DCommon.asserts(await DSFile.remove(DPath.declarePath("files/store/node/nodeTest.generate.jpg")), DEither.isRight);
		expect(await DSFile.readDirectory(DPath.declarePath("files/upload"))).toStrictEqual(
			DEither.success([".gitkeep"]),
		);
	});

	it("send File witch exceed limit", async() => {
		const formData = new FormData();
		formData.append("bool", "true");
		formData.append("name", "nodeTest.generate");
		formData.append(
			"myFile/*\\[0]",
			await createFileToSend(DPath.declarePath("files/fakeFiles/2mb.jpg"), "😄.jpg"),
		);

		await expect(
			fetch("http://localhost:8961/documents", {
				method: "POST",
				body: formData,
			})
				.then(async(response) => ({
					code: response.status,
					body: await response.text(),
					headers: [...response.headers.entries()],
				})),
		).resolves.toStrictEqual({
			code: 422,
			body: "Error: Body size is bigger than 1572864.",
			headers: expect.arrayContaining([
				[
					"information",
					"extract-error",
				],
				[
					"extract-key",
					"request.body",
				],
			]),
		});

		await DCommon.timeout(500);

		expect(await DSFile.readDirectory(DPath.declarePath("files/upload"))).toStrictEqual(
			DEither.success([".gitkeep"]),
		);
	});

	it("receive file", async() => {
		await expect(
			fetch("http://localhost:8961/documents/test", {
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
					"file.send",
				],
				[
					"content-type",
					"text/plain",
				],
			]),
		});
	});
});

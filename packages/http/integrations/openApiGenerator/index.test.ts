import { hub } from "@core";
import * as DSFile from "@duplojs/server/file";
import * as DEither from "@duplojs/lang/either";
import { createHttpServer } from "@duplojs/http/node";
import { openApiGeneratorPlugin, type OpenApiDocument } from "@duplojs/http/openApiGenerator";
import * as DPath from "@duplojs/lang/path";

describe("openApiGenerator", () => {
	const fileName = DPath.createOrThrow(`${import.meta.dirname}/swagger.generate.json`);
	let server = undefined as unknown as Awaited<ReturnType<typeof createHttpServer>>;
	let content = "";
	let document = undefined as unknown as OpenApiDocument;

	beforeAll(async() => {
		const hubWithPlugins = hub.plug(
			openApiGeneratorPlugin({
				outputFile: fileName,
				routePath: "/swagger",
			}),
		);
		server = await createHttpServer(hubWithPlugins, {
			host: "0.0.0.0",
			port: 8966,
		});
		content = DEither.unwrapByInformationOrThrow(await DSFile.readTextFile(fileName), "file-system-read-text-file");
		document = JSON.parse(content) as OpenApiDocument;
	});

	afterAll(() => {
		server.close();
	});

	it("generates input documentation without output metadata", () => {
		expect(content).toMatchSnapshot();
		expect(document.paths["/users"]?.post?.requestBody).toBeDefined();
		expect(document.paths["/users/{userId}"]?.get?.parameters).toContainEqual(expect.objectContaining({
			name: "userId",
			in: "path",
			required: true,
		}));
		expect(document.paths["/users"]?.get?.responses).toStrictEqual({});
	});

	it("serves the generated UI through its inferred response", async() => {
		const result = await fetch("http://localhost:8966/swagger");
		expect(result.status).toBe(200);
		expect(result.headers.get("information")).toBe("swaggerUi");
		expect(result.headers.get("predicted")).toBe("1");
		expect(result.headers.get("content-type")).toBe("text/html");
		expect(await result.text()).toContain("SwaggerUIBundle");
	});
});

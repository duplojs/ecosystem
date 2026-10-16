import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import { TESTImplementation, setEnvironment } from "@duplojs/server";
import * as DSFile from "@duplojs/server/file";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Le traitement utilise l'API publique ; les tests remplacent seulement l'I/O.
function loadGreeting(path: string & DPath.Path) {
	return DEither.rightAsyncPipe(
		DSFile.readTextFile(path),
		(name) => DEither.result("greeting.loaded", `Hello ${name}`),
	);
}

const inputPath = DPath.declarePath("fixtures/name.txt");

describe("loadGreeting", () => {
	beforeEach(() => {
		setEnvironment("TEST");
	});

	afterEach(() => {
		TESTImplementation.clear();
		// Cette suite cible Node ; rétablir BUN ou DENO dans une suite adaptée.
		setEnvironment("NODE");
	});

	it("uses the injected server implementation", async() => {
		const readTextFile = vi.fn(() => Promise.resolve(DEither.right("file-system-read-text-file", "Jane")));
		TESTImplementation.set("readTextFile", readTextFile);

		const result = await loadGreeting(inputPath);
		const greeting = DEither.unwrapByInformationOrThrow(result, "greeting.loaded");

		expect(greeting).toBe("Hello Jane");
		expect(readTextFile).toHaveBeenCalledExactlyOnceWith(inputPath);

		type _CheckGreeting = DCommon.ExpectType<typeof greeting, `Hello ${string}`, "strict">;
	});

	it("preserves the I/O failure", async() => {
		// Reconstituer une erreur publique par son identifiant, sans cast ni
		// import de classe privée. Sa compatibilité est vérifiée à l'injection.
		class PermissionDenied extends DCommon.DuploJSError.parentClass("file-system-read-text-file-permission-denied", Error) {}
		const cause = new Error("Read denied");
		const failure = new PermissionDenied(cause);
		const readTextFile = vi.fn(() => Promise.resolve(DEither.left("file-system-read-text-file-error", failure)));
		TESTImplementation.set("readTextFile", readTextFile);

		const result = await loadGreeting(inputPath);
		const error = DEither.unwrapByInformationOrThrow(result, "file-system-read-text-file-error");

		expect(error).toBe(failure);
		expect(DCommon.DuploJSError.hasIdentifier(error, "file-system-read-text-file-permission-denied")).toBe(true);
		expect(error.cause).toBe(cause);
		expect(readTextFile).toHaveBeenCalledExactlyOnceWith(inputPath);
	});
});

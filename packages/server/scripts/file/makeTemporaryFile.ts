import * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import { implementFunction, nodeCrypto, nodeFileSystem, nodeOs } from "@scripts/implementor";
import type { FileSystemEither } from "./types";

export type MakeTemporaryFileResult = FileSystemEither<
	| DEither.Right<"make-temporary-file", string>
	| DEither.Left<"make-temporary-file-permission-denied", unknown>
	| DEither.Left<"make-temporary-file-already-exists", unknown>
	| DEither.Left<"make-temporary-file-not-directory", unknown>
	| DEither.Left<"make-temporary-file-no-space", unknown>
	| DEither.Left<"make-temporary-file-read-only", unknown>
	| DEither.Left<"make-temporary-file-invalid-argument", unknown>
	| DEither.Left<"make-temporary-file-too-many-open-files", unknown>
	| DEither.Left<"make-temporary-file-error", unknown>
>;

function handleNodeMakeTemporaryFileError(error: unknown): MakeTemporaryFileResult {
	if (
		typeof error === "object"
		&& error !== null
		&& "code" in error
	) {
		if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			return DEither.left("file-system-make-temporary-file-permission-denied", error);
		} else if (error.code === "EEXIST") {
			return DEither.left("file-system-make-temporary-file-already-exists", error);
		} else if (error.code === "ENOTDIR") {
			return DEither.left("file-system-make-temporary-file-not-directory", error);
		} else if (error.code === "ENOSPC") {
			return DEither.left("file-system-make-temporary-file-no-space", error);
		} else if (error.code === "EROFS") {
			return DEither.left("file-system-make-temporary-file-read-only", error);
		} else if (error.code === "EINVAL") {
			return DEither.left("file-system-make-temporary-file-invalid-argument", error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			return DEither.left("file-system-make-temporary-file-too-many-open-files", error);
		}
	}

	return DEither.left("file-system-make-temporary-file-error", error);
}

function handleDenoMakeTemporaryFileError(error: unknown): MakeTemporaryFileResult {
	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		return DEither.left("file-system-make-temporary-file-permission-denied", error);
	}

	if (error instanceof Deno.errors.AlreadyExists) {
		return DEither.left("file-system-make-temporary-file-already-exists", error);
	}

	if (error instanceof Deno.errors.NotADirectory) {
		return DEither.left("file-system-make-temporary-file-not-directory", error);
	}

	if (error instanceof Deno.errors.InvalidData) {
		return DEither.left("file-system-make-temporary-file-invalid-argument", error);
	}

	return DEither.left("file-system-make-temporary-file-error", error);
}

declare module "@scripts/implementor" {
	interface ServerFunction {
		makeTemporaryFile(
			prefix: string & DPath.Segment,
			suffix?: string & DPath.Segment
		): Promise<MakeTemporaryFileResult>;
	}
}

export const makeTemporaryFile = implementFunction(
	"makeTemporaryFile",
	{
		NODE: async(prefix, suffix) => {
			const fs = await nodeFileSystem.value;
			const os = await nodeOs.value;
			const crypto = await nodeCrypto.value;

			const tempPath = DCommon.forwardAsserts(os.tmpdir(), DPath.is);
			const fileName = DCommon.forwardAsserts(`${prefix}${crypto.randomUUID()}${suffix ?? ""}`, DPath.isSegment);

			const fileTemporaryPath = DPath.resolveRelative([
				tempPath,
				fileName,
			]);
			return fs.open(fileTemporaryPath, "wx")
				.then((fh) => fh.close())
				.then(() => DEither.right("file-system-make-temporary-file", fileTemporaryPath))
				.catch(handleNodeMakeTemporaryFileError);
		},
		DENO: (prefix, suffix) => Deno.makeTempFile({
			prefix,
			suffix,
		})
			.then((value) => DEither.right("file-system-make-temporary-file", value))
			.catch(handleDenoMakeTemporaryFileError),
	},
);

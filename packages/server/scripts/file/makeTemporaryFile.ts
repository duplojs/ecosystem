import * as DCommon from "@duplojs/lang/common";
import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import { implementFunction, nodeCrypto, nodeFileSystem, nodeOs } from "@scripts/implementor";

class MakeTemporaryFileErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-make-temporary-file-permission-denied", Error) {}
class MakeTemporaryFileErrorAlreadyExists extends DCommon.DuploJSError.parentClass("file-system-make-temporary-file-already-exists", Error) {}
class MakeTemporaryFileErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-make-temporary-file-not-directory", Error) {}
class MakeTemporaryFileErrorNoSpace extends DCommon.DuploJSError.parentClass("file-system-make-temporary-file-no-space", Error) {}
class MakeTemporaryFileErrorReadOnly extends DCommon.DuploJSError.parentClass("file-system-make-temporary-file-read-only", Error) {}
class MakeTemporaryFileErrorInvalidArgument extends DCommon.DuploJSError.parentClass("file-system-make-temporary-file-invalid-argument", Error) {}
class MakeTemporaryFileErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-make-temporary-file-too-many-open-files", Error) {}
class MakeTemporaryFileError extends DCommon.DuploJSError.parentClass("file-system-make-temporary-file-error", Error) {}

export type MakeTemporaryFileErrors = (
	| MakeTemporaryFileErrorPermissionDenied
	| MakeTemporaryFileErrorAlreadyExists
	| MakeTemporaryFileErrorNotDirectory
	| MakeTemporaryFileErrorNoSpace
	| MakeTemporaryFileErrorReadOnly
	| MakeTemporaryFileErrorInvalidArgument
	| MakeTemporaryFileErrorTooManyOpenFiles
	| MakeTemporaryFileError
);

export type MakeTemporaryFileResult = (
	| DEither.Right<"file-system-make-temporary-file", string>
	| DEither.Left<"file-system-make-temporary-file-error", MakeTemporaryFileErrors>
);

function handleNodeMakeTemporaryFileError(error: Error) {
	let makeTemporaryFileError: MakeTemporaryFileErrors | undefined = undefined;

	if ("code" in error) {
		if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			makeTemporaryFileError = new MakeTemporaryFileErrorPermissionDenied(error);
		} else if (error.code === "EEXIST") {
			makeTemporaryFileError = new MakeTemporaryFileErrorAlreadyExists(error);
		} else if (error.code === "ENOTDIR") {
			makeTemporaryFileError = new MakeTemporaryFileErrorNotDirectory(error);
		} else if (error.code === "ENOSPC") {
			makeTemporaryFileError = new MakeTemporaryFileErrorNoSpace(error);
		} else if (error.code === "EROFS") {
			makeTemporaryFileError = new MakeTemporaryFileErrorReadOnly(error);
		} else if (error.code === "EINVAL") {
			makeTemporaryFileError = new MakeTemporaryFileErrorInvalidArgument(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			makeTemporaryFileError = new MakeTemporaryFileErrorTooManyOpenFiles(error);
		}
	}

	if (makeTemporaryFileError === undefined) {
		makeTemporaryFileError = new MakeTemporaryFileError(error);
	}

	return DEither.left("file-system-make-temporary-file-error", makeTemporaryFileError);
}

function handleDenoMakeTemporaryFileError(error: Error) {
	let makeTemporaryFileError: MakeTemporaryFileErrors | undefined = undefined;

	if (
		error instanceof Deno.errors.PermissionDenied
		|| error instanceof Deno.errors.NotCapable
	) {
		makeTemporaryFileError = new MakeTemporaryFileErrorPermissionDenied(error);
	} else if (error instanceof Deno.errors.AlreadyExists) {
		makeTemporaryFileError = new MakeTemporaryFileErrorAlreadyExists(error);
	} else if (error instanceof Deno.errors.NotADirectory) {
		makeTemporaryFileError = new MakeTemporaryFileErrorNotDirectory(error);
	} else if (error instanceof Deno.errors.InvalidData) {
		makeTemporaryFileError = new MakeTemporaryFileErrorInvalidArgument(error);
	}

	if (makeTemporaryFileError === undefined) {
		makeTemporaryFileError = new MakeTemporaryFileError(error);
	}

	return DEither.left("file-system-make-temporary-file-error", makeTemporaryFileError);
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

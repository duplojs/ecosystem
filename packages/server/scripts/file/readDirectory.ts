import * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import { implementFunction, nodeFileSystem } from "@scripts/implementor";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import { getCurrentWorkDirectoryOrThrow } from "@scripts/common";

class ReadDirectoryErrorNotFound extends DCommon.DuploJSError.parentClass("file-system-read-directory-not-found", Error) {}
class ReadDirectoryErrorPermissionDenied extends DCommon.DuploJSError.parentClass("file-system-read-directory-permission-denied", Error) {}
class ReadDirectoryErrorNotDirectory extends DCommon.DuploJSError.parentClass("file-system-read-directory-not-directory", Error) {}
class ReadDirectoryErrorTooManyOpenFiles extends DCommon.DuploJSError.parentClass("file-system-read-directory-too-many-open-files", Error) {}
class ReadDirectoryErrorBusy extends DCommon.DuploJSError.parentClass("file-system-read-directory-busy", Error) {}
class ReadDirectoryError extends DCommon.DuploJSError.parentClass("file-system-read-directory-error", Error) {}

export type ReadDirectoryErrors = (
	| ReadDirectoryErrorNotFound
	| ReadDirectoryErrorPermissionDenied
	| ReadDirectoryErrorNotDirectory
	| ReadDirectoryErrorTooManyOpenFiles
	| ReadDirectoryErrorBusy
	| ReadDirectoryError
);

function handleNodeReadDirectoryError(error: Error) {
	let readDirectoryError: ReadDirectoryErrors | undefined = undefined;

	if ("code" in error) {
		if (error.code === "ENOENT") {
			readDirectoryError = new ReadDirectoryErrorNotFound(error);
		} else if (
			error.code === "EACCES"
			|| error.code === "EPERM"
		) {
			readDirectoryError = new ReadDirectoryErrorPermissionDenied(error);
		} else if (error.code === "ENOTDIR") {
			readDirectoryError = new ReadDirectoryErrorNotDirectory(error);
		} else if (
			error.code === "EMFILE"
			|| error.code === "ENFILE"
		) {
			readDirectoryError = new ReadDirectoryErrorTooManyOpenFiles(error);
		} else if (error.code === "EBUSY") {
			readDirectoryError = new ReadDirectoryErrorBusy(error);
		}
	}

	if (readDirectoryError === undefined) {
		readDirectoryError = new ReadDirectoryError(error);
	}

	return DEither.left("file-system-read-directory-error", readDirectoryError);
}

interface ReadDirectoryParams {
	recursive?: boolean;
	absolute?: boolean;
	matcher?: DPath.PathMatcher;
}

export type ReadDirectoryResult<
	GenericParams extends ReadDirectoryParams = ReadDirectoryParams,
> = (
	| DEither.Right<
		"file-system-read-directory",
		readonly (
			& string
			& DPath.Path
			& (
				DCommon.IsEqual<GenericParams["absolute"], true> extends true
					? DPath.Absolute
					: unknown
			)
		)[]
	>
	| DEither.Left<"file-system-read-directory-error", ReadDirectoryErrors>
);

declare module "@scripts/implementor" {
	interface ServerFunction {
		readDirectory<
			const GenericParams extends ReadDirectoryParams = {},
		>(
			path: string & DPath.Path,
			params?: GenericParams,
		): Promise<
			ReadDirectoryResult<GenericParams>
		>;
	}
}

export const readDirectory = implementFunction(
	"readDirectory",
	{
		NODE: (path, params) => {
			const result = (
				params?.absolute
					? nodeFileSystem.value.readdir(
						path,
						{
							recursive: params.recursive,
							withFileTypes: true,
						},
					).then(
						(value) => DArray.map(
							value,
							({ name, parentPath }) => DPath.resolveFrom(
								getCurrentWorkDirectoryOrThrow(),
								[DPath.normalize(`${parentPath}/${name}`)!],
							),
						),
					)
					: nodeFileSystem.value.readdir(
						path,
						{ recursive: params?.recursive },
					).then(
						(value) => DArray.map(
							value,
							(subPath) => DPath.normalize(subPath)!,
						),
					)
			)
				.then(
					DCommon.innerPipe(
						(paths) => params?.matcher
							? DArray.filter(
								paths,
								params.matcher,
							)
							: paths,
						(value) => DEither.right(
							"file-system-read-directory",
							value,
						),
					),
				)
				.catch(handleNodeReadDirectoryError);

			return result as never;
		},
	},
);

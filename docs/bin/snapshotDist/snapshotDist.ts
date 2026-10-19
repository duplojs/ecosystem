import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import * as DKind from "@duplojs/lang/kind";
import * as DPath from "@duplojs/lang/path";
import * as DString from "@duplojs/lang/string";
import * as DSCommon from "@duplojs/server/common";
import * as DSFile from "@duplojs/server/file";

interface SnapshotDistParams {
	readonly rootDir: DSFile.FolderInterface;
	readonly output: DSFile.FolderInterface;
	readonly inputPattern: readonly string[];
}

export class NoSnapshotFoldersError extends DKind.parentClass("snapshot-dist-no-folders", Error) {
	public constructor(rootDir: string & DPath.Path) {
		super(rootDir, `No folders matched inputPattern in ${rootDir}.`);
	}
}

export class SnapshotPackageFolderNotFoundError extends DKind.parentClass("snapshot-dist-package-folder-not-found", Error) {
	public constructor(packagePath: string & DPath.Path) {
		super(packagePath, `Snapshot package folder not found: ${packagePath}`);
	}
}

const ignoreNodeModules = DPath.createMatcher(["**", "!node_modules"]);

type AbsolutePath = string & DPath.Absolute & DPath.Path;

async function findFolders(
	root: AbsolutePath,
	matcher: DPath.PathMatcher,
	path = root,
): Promise<readonly AbsolutePath[]> {
	return DCommon.asyncPipe(
		DSFile.walkDirectory(path, { matcher: ignoreNodeModules }),
		DEither.unwrapRightOrThrow,
		DGenerator.filter(DSFile.isFolderInterface),
		DGenerator.asyncReduce(
			DGenerator.reduceFrom<readonly AbsolutePath[]>([]),
			async({ item: entry, lastValue, next, nextPush }) => {
				const relativePath = DPath.computeRelative(root, entry.path);

				if (matcher(relativePath)) {
					return nextPush(lastValue, entry.path);
				}

				return next(DArray.concat(lastValue, await findFolders(root, matcher, entry.path)));
			},
		),
	);
}

async function copyDeclarations(source: string & DPath.Path, destination: string & DPath.Path): Promise<void> {
	return DCommon.asyncPipe(
		DSFile.walkDirectory(source, { matcher: ignoreNodeModules }),
		DEither.unwrapRightOrThrow,
		DGenerator.asyncReduce(
			DGenerator.reduceFrom<undefined>(undefined),
			async({ item: entry, next }) => {
				const target = DCommon.pipe(
					entry.getName(),
					DCommon.forwardAsserts(DCommon.isType("string")),
					(name) => DPath.resolveRelative([destination, name]),
				);

				if (DSFile.isFolderInterface(entry)) {
					await copyDeclarations(entry.path, target);
				} else if (DSFile.isFileInterface(entry) && DString.endsWith(entry.path, ".d.ts")) {
					await DCommon.asyncPipe(
						DSFile.ensureDirectory(destination),
						DEither.unwrapRightOrThrow,
						() => DSFile.copy(entry.path, target),
						DEither.unwrapRightOrThrow,
					);
				}

				return next(undefined);
			},
		),
	);
}

export async function snapshotDist({ rootDir, output, inputPattern }: SnapshotDistParams): Promise<void> {
	const root = DPath.resolveFrom(DSCommon.getCurrentWorkDirectoryOrThrow(), [rootDir.path]);
	const folders = await DCommon.asyncPipe(
		findFolders(root, DPath.createMatcher(inputPattern)),
		DCommon.when(
			(value) => value.length === 0,
			() => {
				throw new NoSnapshotFoldersError(rootDir.path);
			},
		),
	);

	for (const source of folders) {
		const packagePath = DCommon.pipe(
			source,
			DPath.getParentFolderPath,
			DCommon.forwardAsserts(DCommon.isType("string")),
			DPath.getBaseName,
			DCommon.forwardAsserts(DCommon.isType("string")),
			(packageName) => DPath.resolveRelative([output.path, packageName]),
		);
		const destination = DCommon.pipe(
			source,
			DPath.getBaseName,
			DCommon.forwardAsserts(DCommon.isType("string")),
			(folderName) => DPath.resolveRelative([packagePath, folderName]),
		);

		await DCommon.asyncPipe(
			DSFile.createFolderInterface(packagePath).isFolder(),
			DCommon.when(
				(exists) => !exists,
				() => {
					throw new SnapshotPackageFolderNotFoundError(packagePath);
				},
			),
			() => copyDeclarations(source, destination),
		);
	}
}

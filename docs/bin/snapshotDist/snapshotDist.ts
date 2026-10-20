import * as DArray from "@duplojs/lang/array";
import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DGenerator from "@duplojs/lang/generator";
import * as DKind from "@duplojs/lang/kind";
import * as DObject from "@duplojs/lang/object";
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

async function copyDeclarations(
	source: string & DPath.Path,
	destination: string & DPath.Path,
): Promise<readonly AbsolutePath[]> {
	return DCommon.asyncPipe(
		DSFile.walkDirectory(source, { matcher: ignoreNodeModules }),
		DEither.unwrapRightOrThrow,
		DGenerator.asyncReduce(
			DGenerator.reduceFrom<readonly AbsolutePath[]>([]),
			async({ item: entry, lastValue, next }) => {
				const target = DCommon.pipe(
					entry.getName(),
					DCommon.forwardAsserts(DCommon.isType("string")),
					(name) => DPath.resolveRelative([destination, name]),
				);

				if (DSFile.isFolderInterface(entry)) {
					return next(DArray.concat(lastValue, await copyDeclarations(entry.path, target)));
				} else if (DSFile.isFileInterface(entry) && DString.endsWith(entry.path, ".d.ts")) {
					await DCommon.asyncPipe(
						DSFile.ensureDirectory(destination),
						DEither.unwrapRightOrThrow,
						() => DSFile.copy(entry.path, target),
						DEither.unwrapRightOrThrow,
					);
					return next(DArray.concat(lastValue, [entry.path]));
				}

				return next(lastValue);
			},
		),
	);
}

export async function snapshotDist({ rootDir, output, inputPattern }: SnapshotDistParams): Promise<void> {
	const root = DPath.resolveFrom(DSCommon.getCurrentWorkDirectoryOrThrow(), [rootDir.path]);
	const version = DCommon.pipe(
		DPath.resolveFrom(DSCommon.getCurrentWorkDirectoryOrThrow(), [output.path]),
		DPath.getBaseName,
		DCommon.forwardAsserts(DCommon.isType("string")),
	);
	const folders = await DCommon.asyncPipe(
		findFolders(root, DPath.createMatcher(inputPattern)),
		DCommon.when(
			DArray.lengthEqual(0),
			() => {
				throw new NoSnapshotFoldersError(rootDir.path);
			},
		),
	);

	await DCommon.asyncPipe(
		folders,
		DGenerator.asyncMap(async(source) => {
			const sourcePackagePath = DPath.resolveFrom(source, [DPath.createOrThrow("..")]);
			const packagePath = DCommon.pipe(
				sourcePackagePath,
				DPath.getBaseName,
				DCommon.forwardAsserts(DCommon.isType("string")),
				(name) => DPath.resolveRelative([output.path, name]),
			);
			const destination = DCommon.pipe(
				source,
				DPath.getBaseName,
				DCommon.forwardAsserts(DCommon.isType("string")),
				(name) => DPath.resolveRelative([packagePath, name]),
			);
			const sourceManifestPath = DPath.resolveRelative([sourcePackagePath, DPath.createOrThrow("package.json")]);
			const manifest = await DCommon.asyncPipe(
				DSFile.readJsonFile(sourceManifestPath),
				DEither.unwrapRightOrThrow,
				DCommon.forwardAsserts(DCommon.isType("object")),
			);
			const declarations = await copyDeclarations(source, destination);
			const declarationPaths = DArray.map(
				declarations,
				(path) => DPath.computeRelative(sourcePackagePath, path),
			);
			const dependencies = DCommon.pipe(
				[manifest.peerDependencies ?? {}, manifest.dependencies ?? {}],
				DGenerator.map(
					DCommon.innerPipe(
						DCommon.forwardAsserts(DCommon.isType("object")),
						DObject.entries,
					),
				),
				DGenerator.flat,
				DGenerator.map(
					([name, constraint]) => [
						DString.replace(name, /^@duplojs\//, `@duplojs-${version}/`),
						constraint,
					] as const,
				),
				DObject.fromEntries,
			);
			const exports = DCommon.pipe(
				manifest.exports ?? {},
				DCommon.forwardAsserts(DCommon.isType("object")),
				DObject.entries,
				DArray.reduce(
					DArray.reduceFrom<Record<string, { types: string }>>({}),
					({ element: [subpath, value], lastValue, next, nextWithObject }) => {
						const types = DCommon.isType(value, "object")
							? value.types
							: value;

						if (!DCommon.isType(types, "string") || !DString.endsWith(types, ".d.ts")) {
							return next(lastValue);
						}

						const matches = DPath.createMatcher(DString.replace(types, /^\.\//, ""));

						return DArray.some(declarationPaths, matches)
							? nextWithObject(lastValue, { [subpath]: { types } })
							: next(lastValue);
					},
				),
			);

			const snapshotManifest = {
				name: DCommon.pipe(
					manifest.name,
					DCommon.forwardAsserts(DCommon.isType("string")),
					DString.replace(/^@duplojs\//, `@duplojs-${version}/`),
				),
				private: true,
				type: "module",
				...DObject.pick(manifest, ["types"]),
				exports,
				dependencies,
			};

			const manifestPath = DPath.resolveRelative([packagePath, DPath.createOrThrow("package.json")]);

			await DCommon.asyncPipe(
				DSFile.ensureDirectory(packagePath),
				DEither.unwrapRightOrThrow,
				() => DSFile.writeJsonFile(manifestPath, snapshotManifest, { space: 2 }),
				DEither.unwrapRightOrThrow,
			);
		}),
		DGenerator.execute,
	);
}

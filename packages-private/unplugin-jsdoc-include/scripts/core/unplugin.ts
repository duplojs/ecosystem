import { createUnplugin } from "unplugin";
import { resolver } from "./resolver";
import * as DSFile from "@duplojs/server/file";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DObject from "@duplojs/lang/object";
import * as DGenerator from "@duplojs/lang/generator";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import * as DString from "@duplojs/lang/string";

export interface UnpluginJsdocIncludeParams {
	includedPath: string & DPath.Path;
	lineChar?: string;
}

interface BundleFile {
	fileName: string;
	source?: DCommon.AnyValue;
	code?: string;
}

type Bundle = Record<string, BundleFile>;

interface OutputOptions {
	dir?: string;
	file?: string;
}

const includeToken = "{@include ";

function isFileInterface(
	entry: DSFile.FileInterface | DSFile.FolderInterface | DSFile.UnknownEntryInterface,
): entry is DSFile.FileInterface {
	return "getExtension" in entry;
}

export const unpluginJsdocInclude = createUnplugin(
	(options: UnpluginJsdocIncludeParams) => {
		const { includedPath, lineChar = "\n" } = options;

		const generateBundle = async(_options: unknown, bundle: Bundle) => {
			await DCommon.pipe(
				bundle,
				DObject.values,
				DArray.filter(
					(file) => (
						(DCommon.isType(file.source, "string") && DString.includes(file.source, includeToken))
						|| (DCommon.isType(file.code, "string") && DString.includes(file.code, includeToken))
					),
				),
				DGenerator.asyncMap(async(file) => {
					if (DCommon.isType(file.source, "string")) {
						file.source = await resolver({
							source: file.source,
							includedPath,
							lineChar,
						});
					} else if (DCommon.isType(file.code, "string")) {
						file.code = await resolver({
							source: file.code,
							includedPath,
							lineChar,
						});
					}
				}),
				DGenerator.execute,
			);
		};

		const resolveFile = async(path: string & DPath.Path) => {
			const readResult = await DSFile.readTextFile(path);

			if (DEither.isLeft(readResult)) {
				throw new Error(`Unable to read output file: ${path}`);
			}

			const source = DEither.unwrapRight(readResult);

			if (!DString.includes(source, includeToken)) {
				return;
			}

			const writeResult = await DSFile.writeTextFile(
				path,
				await resolver({
					source,
					includedPath,
					lineChar,
				}),
			);

			if (DEither.isLeft(writeResult)) {
				throw new Error(`Unable to write output file: ${path}`);
			}
		};

		const resolveOutputFiles = async({ dir, file }: OutputOptions) => {
			if (file) {
				await resolveFile(DPath.createOrThrow(file));
			}

			if (!dir) {
				return;
			}

			const result = await DSFile.walkDirectory(
				DPath.createOrThrow(dir),
				{
					recursive: true,
				},
			);

			if (DEither.isLeft(result)) {
				throw new Error(`Unable to walk output directory: ${dir}`);
			}

			await DCommon.pipe(
				DEither.unwrapRight(result),
				DGenerator.filter(isFileInterface),
				DGenerator.asyncMap(
					(fileInterface) => resolveFile(fileInterface.path),
				),
				DGenerator.execute,
			);
		};

		return {
			name: "duplojs-unplugin-jsdoc-include",
			enforce: "post",
			rollup: {
				generateBundle,
				writeBundle: resolveOutputFiles,
			},
			vite: {
				generateBundle,
				writeBundle: resolveOutputFiles,
			},
			rolldown: {
				generateBundle,
				writeBundle: resolveOutputFiles,
			},
		};
	},
);

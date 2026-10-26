import * as DGenerator from "@duplojs/lang/generator";
import * as DEither from "@duplojs/lang/either";
import * as DPath from "@duplojs/lang/path";
import * as DString from "@duplojs/lang/string";
import * as DSFile from "@duplojs/server/file";
import { TypescriptNativeAPI } from "@duplojs/tools";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";

export interface CreateIndexSliceParams {
	workDirectory: string & DPath.Absolute;
	isInSlice: DPath.PathMatcher;
}

export function createIndexSlice(
	params: CreateIndexSliceParams,
) {
	return DEither.rightAsyncPipe(
		DSFile.walkDirectory(
			params.workDirectory,
			{
				matcher: (path) => {
					if (!DString.endsWith(path, ".ts")) {
						return false;
					}

					const relativePath = DPath.computeRelative(
						params.workDirectory,
						path,
					);

					return params.isInSlice(relativePath);
				},
				recursive: true,
			},
		),
		DGenerator.filter(DSFile.isFileInterface),
		DGenerator.map(
			(item) => TypescriptNativeAPI.factory.createExportDeclaration(
				undefined,
				false,
				undefined,
				TypescriptNativeAPI.factory.createStringLiteral(
					`./${DPath.computeRelative(params.workDirectory, item.path)}`,
					TypescriptNativeAPI.TokenFlags.None,
				),
			),
		),
		DArray.from,
		(statements) => {
			const api = new TypescriptNativeAPI.API();

			return DCommon.asyncPipe(
				statements,
				DArray.map((statement) => api.printer.printNode(statement)),
				DCommon.promiseAll,
				DString.join("\n"),
				DCommon.tap(() => api.close()),
			);
		},
	);
}

import * as DSFile from "@duplojs/server/file";
import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DEither from "@duplojs/lang/either";
import * as DString from "@duplojs/lang/string";

import { useRouteBuilder } from "@core/builders";
import { IgnoreByRouteStoreMetadata } from "@core/metadata";
import { ResponseContract } from "@core/response";
import type { RoutePath } from "@core/route";
import { createCacheControllerHooks } from "@plugin-cacheController/hooks";
import { type CacheControlDirectives } from "@plugin-cacheController/types";
import * as DTuple from "@duplojs/lang/tuple";
import * as DSDataStructure from "@duplojs/server/dataStructure";
import * as DPath from "@duplojs/lang/path";

interface MakeRouteFolderParams {
	readonly source: DSFile.FolderInterface;
	readonly prefix: RoutePath | DCommon.AnyTuple<RoutePath>;
	readonly cacheControlConfig?: CacheControlDirectives;
	readonly directoryFallBackFile?: string & DPath.Segment;
}

const dotDotRegExp = /(^|\/)\.\.(\/|$)/;

export function makeRouteFolder(params: MakeRouteFolderParams) {
	const localPrefix = DArray.coalescing(params.prefix);

	const routePath = DTuple.map(
		localPrefix,
		(prefix) => <const>`${prefix}/*`,
	);

	const prefixRegex = DCommon.pipe(
		localPrefix,
		DArray.map(DCommon.escapeRegExp),
		DString.join("|"),
		(value) => new RegExp(`^(?:${value})(?:/|$)`),
	);

	function preparePath(path: string) {
		if (DString.test(path, dotDotRegExp)) {
			return DEither.none();
		}

		const nomalizedPath = DPath.normalize(path);

		if (!nomalizedPath || !DPath.isAbsolute(nomalizedPath)) {
			return DEither.none();
		}

		return DEither.some(
			DPath.resolveRelative([
				params.source.path,
				DPath.createOrThrow(
					DString.replace(nomalizedPath, prefixRegex, ""),
				),
			]),
		);
	}

	return useRouteBuilder(
		"GET",
		routePath,
		{
			metadata: [IgnoreByRouteStoreMetadata()],
			hooks: [createCacheControllerHooks(params.cacheControlConfig)],
		},
	)
		.handler(
			[
				ResponseContract.ok("resource.found", DSDataStructure.file()),
				ResponseContract.notFound("resource.notfound"),
				ResponseContract.notModified("resource.notModified"),
			],
			async(__, { request, response }) => {
				const resultResourcePath = preparePath(request.path);

				if (DEither.isLeft(resultResourcePath)) {
					return response("resource.notfound");
				}

				const resourcePath = DEither.unwrapRight(resultResourcePath);

				const resultStat = await DSFile.stat(resourcePath);

				if (DEither.isLeft(resultStat)) {
					return response("resource.notfound");
				}

				const stat = DEither.unwrapRight(resultStat);

				if (stat.isDirectory && !params.directoryFallBackFile) {
					return response("resource.notfound");
				}

				const resource = DSFile.createFileInterface(
					stat.isDirectory && params.directoryFallBackFile
						? DPath.resolveRelative([resourcePath, params.directoryFallBackFile])
						: resourcePath,
				);

				const resultResourceStat = stat.isFile
					? stat
					: await resource.stat();

				if (DEither.isLeft(resultResourceStat)) {
					return response("resource.notfound");
				}

				const resourceStat = DEither.unwrapRight(resultResourceStat);

				if (!resourceStat.isFile) {
					return response("resource.notfound");
				}

				if (
					request.headers["if-modified-since"]
					&& typeof request.headers["if-modified-since"] === "string"
					&& resourceStat.modifiedAt
					&& new Date(request.headers["if-modified-since"]).getTime() >= resourceStat.modifiedAt.getTime()
				) {
					return response("resource.notModified")
						.setHeader("last-modified", resourceStat.modifiedAt.toISOString());
				}

				return resourceStat.modifiedAt
					? response("resource.found", resource)
						.setHeader("last-modified", resourceStat.modifiedAt.toISOString())
					: response("resource.found", resource);
			},
		);
}

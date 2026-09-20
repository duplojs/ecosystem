import type * as DSFile from "@duplojs/server/file";
import type * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DEither from "@duplojs/lang/either";
import { useRouteBuilder } from "@core/builders";
import { IgnoreByRouteStoreMetadata } from "@core/metadata";
import { ResponseContract } from "@core/response";
import type { RoutePath } from "@core/route";
import { createCacheControllerHooks } from "@plugin-cacheController/hooks";
import { type CacheControlDirectives } from "@plugin-cacheController/types";
import { createKind } from "./kind";
import * as DKind from "@duplojs/lang/kind";
import * as DSDataStructure from "@duplojs/server/dataStructure";

interface MakeRouteFileParams {
	readonly source: DSFile.FileInterface;
	readonly path: RoutePath | DCommon.AnyTuple<RoutePath>;
	readonly cacheControlConfig?: CacheControlDirectives;
}

export class MissingSelectedStaticFileError extends DKind.parentClass(
	createKind("missing-selected-static-file"),
	Error,
) {
	public constructor(
		public source: DSFile.FileInterface,
	) {
		super({}, `Missing selected static file: ${source.path}.`);
	}
}

export class SelectedStaticFileIsNotFileError extends DKind.parentClass(
	createKind("selected-static-file-is-not-file"),
	Error,
) {
	public constructor(
		public source: DSFile.FileInterface,
	) {
		super({}, `Selected static file is not file: ${source.path}.`);
	}
}

export function makeRouteFile(params: MakeRouteFileParams) {
	const localPath = DArray.coalescing(params.path);

	return useRouteBuilder(
		"GET",
		localPath,
		{
			metadata: [IgnoreByRouteStoreMetadata()],
			hooks: [createCacheControllerHooks(params.cacheControlConfig)],
		},
	)
		.handler(
			[
				ResponseContract.ok("resource.found", DSDataStructure.file()),
				ResponseContract.notModified("resource.notModified"),
			],
			async(__, { response, request }) => {
				const sourceStatResult = await params.source.stat();

				if (DEither.isLeft(sourceStatResult)) {
					throw new MissingSelectedStaticFileError(params.source);
				}

				const resourceStat = DEither.unwrapRight(sourceStatResult);

				if (!resourceStat.isFile) {
					throw new SelectedStaticFileIsNotFileError(params.source);
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
					? response("resource.found", params.source)
						.setHeader("last-modified", resourceStat.modifiedAt.toISOString())
					: response("resource.found", params.source);
			},
		);
}

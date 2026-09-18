import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import * as DPattern from "@duplojs/lang/pattern";
import * as DSFile from "@duplojs/server/file";
import type { HubPlugin } from "@core/hub";
import type { RoutePath } from "@core/route";
import { createKind } from "./kind";
import { makeRouteFile } from "./makeRouteFile";
import { makeRouteFolder } from "./makeRouteFolder";
import { type CacheControlDirectives } from "@plugin-cacheController/types";
import * as DKind from "@duplojs/lang/kind";
import type * as DPath from "@duplojs/lang/path";

export interface BaseStaticPluginParams {
	readonly cacheControlConfig?: CacheControlDirectives;
}

export interface StaticPluginFileParams extends BaseStaticPluginParams {
	readonly path: RoutePath | DCommon.AnyTuple<RoutePath>;
}

export interface StaticPluginFolderParams extends BaseStaticPluginParams {
	readonly prefix: RoutePath | DCommon.AnyTuple<RoutePath>;
	readonly directoryFallBackFile?: string & DPath.Segment;
}

export class StaticPluginError extends DKind.parentClass(
	createKind("static-plugin"),
	Error,
) {
	public constructor(
		public information: string,
		public error: unknown,
	) {
		super(null, `Error during registration static route: ${information}`);
	}
}

export function staticPlugin(
	source: DSFile.FolderInterface,
	params: StaticPluginFolderParams,
): HubPlugin;

export function staticPlugin(
	source: DSFile.FileInterface,
	params: StaticPluginFileParams,
): HubPlugin;

export function staticPlugin(
	...args:
		| [DSFile.FolderInterface, StaticPluginFolderParams]
		| [DSFile.FileInterface, StaticPluginFileParams]
): HubPlugin {
	const route = DPattern.match(args)
		.with(
			[DCommon.toCurriedPredicate(DSFile.isFolderInterface)],
			([source, params]) => makeRouteFolder({
				source,
				...params,
			}),
		)
		.with(
			[DCommon.toCurriedPredicate(DSFile.isFileInterface)],
			([source, params]) => makeRouteFile({
				source,
				...params,
			}),
		)
		.exhaustive();

	return {
		name: "static",
		routes: [route],
		hooksHubLifeCycle: [
			{
				beforeStartServer: async() => {
					const statResult = await args[0].stat();

					if (DEither.isLeft(statResult)) {
						throw new StaticPluginError(
							`source does not exit (${args[0].path}).`,
							DEither.unwrapLeft(statResult),
						);
					}

					const stat = DEither.unwrapRight(statResult);

					if (DSFile.isFileInterface(args[0]) && !stat.isFile) {
						throw new StaticPluginError(
							`source does not file (${args[0].path}).`,
							stat,
						);
					} else if (DSFile.isFolderInterface(args[0]) && stat.isFile) {
						throw new StaticPluginError(
							`source does not folder (${args[0].path}).`,
							stat,
						);
					}
				},
			},
		],
	};
}

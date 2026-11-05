import type * as DCommon from "@scripts/common";
import type { Absolute, Path } from "./constraints";
import { resolveRelative } from "./resolveRelative";
import type { AnyPath, RequireSegments } from "./types";

export interface ResolveFromParams {
	stayInOrigin?: boolean;
}

export function resolveFrom<
	const GenericSegments extends readonly AnyPath[],
	const GenericParams extends ResolveFromParams = never,
>(
	origin: string & Absolute,
	segments: GenericSegments & RequireSegments<GenericSegments>,
	params?: GenericParams,
): (string & Path & Absolute) | (
	DCommon.BreakGenericLink<
		GenericParams extends { stayInOrigin?: false | undefined }
			? never
			: null
	>
);

export function resolveFrom(
	origin: string,
	segments: readonly string[],
	params?: ResolveFromParams,
): any {
	const resultRelative = resolveRelative(segments as never);

	if (
		params?.stayInOrigin
		&& (
			resultRelative === ".."
			|| resultRelative.startsWith("../")
			|| resultRelative.startsWith("/")
		)
	) {
		return null;
	}

	const result = resolveRelative([origin as never, resultRelative]);

	return result;
}

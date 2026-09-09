import type * as DCommon from "@scripts/common";
import type { Absolute, Path, Segment } from "./constraints";
import { resolveRelative } from "./resolveRelative";
import type { RequireSegments } from "./types";

export interface ResolveFromParams {
	stayInOrigin?: boolean;
}

export function resolveFrom<
	const GenericSegments extends readonly (string & (Path | Absolute | Segment))[],
	const GenericParams extends ResolveFromParams,
>(
	origin: string & Absolute,
	segments: GenericSegments & RequireSegments<GenericSegments>,
	params?: GenericParams,
): (string & Absolute) | (
	DCommon.BreakGenericLink<
		DCommon.Or<[
			DCommon.IsEqual<
				GenericParams["stayInOrigin"],
				ResolveFromParams["stayInOrigin"]
			>,
			DCommon.IsEqual<GenericParams["stayInOrigin"], false>,
			DCommon.IsEqual<GenericParams["stayInOrigin"], unknown>,
		]> extends true
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

import type * as DCommon from "@scripts/common";
import type { Absolute, Path, Segment } from "./constraints";
import type { RequireSegments } from "./types";

type HasAbsolutePath<
	GenericSegments extends readonly (string & (Path | Absolute | Segment))[],
> = DCommon.ContainExtends<
	{
		[Prop in keyof GenericSegments]: [DCommon.IsExtends<GenericSegments[Prop], Absolute>]
	}[Extract<keyof GenericSegments, number>],
	[true]
>;

export function resolveRelative<
	const GenericSegments extends readonly (string & (Path | Absolute | Segment))[],
>(
	segments: GenericSegments & RequireSegments<GenericSegments>,
): string & Path & (
	DCommon.BreakGenericLink<
		HasAbsolutePath<GenericSegments> extends true
			? Absolute
			: unknown
	>
);

export function resolveRelative(
	paths: readonly (string & Path)[],
) {
	let absolute = false;
	const result: string[] = [];

	for (const path of paths) {
		if (path === ".") {
			continue;
		}

		if (path.startsWith("/")) {
			absolute = true;
			result.length = 0;
		}

		for (const segment of path.split("/")) {
			if (segment === "") {
				continue;
			}

			if (segment === "..") {
				if (result.length && result.at(-1) !== "..") {
					result.pop();
				} else if (!absolute) {
					result.push("..");
				}
			} else {
				result.push(segment);
			}
		}
	}

	if (absolute) {
		return `/${result.join("/")}`;
	}

	return result.join("/") || ".";
}

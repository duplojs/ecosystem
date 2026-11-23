import * as DString from "@scripts/string";
import type { Path } from "./constraints";
import { type AnyPath } from "./types";

export function normalize(
	path: string,
): AnyPath | null {
	let normalizedPath = path;

	if (DString.test(path, /^file:\/\/\/?[^/]?/i)) {
		try {
			const url = new URL(path);

			normalizedPath = decodeURIComponent(
				`/${url.hostname}${url.pathname}`,
			);
		} catch {
			return null;
		}
	}

	if (normalizedPath.includes("\0")) {
		return null;
	}

	const absolute = normalizedPath.startsWith("/");
	const result: string[] = [];

	for (const segment of normalizedPath.split("/")) {
		if (segment === "" || segment === ".") {
			continue;
		}

		if (segment === "..") {
			if (
				result.length !== 0
				&& result.at(-1) !== ".."
			) {
				result.pop();
			} else if (!absolute) {
				result.push("..");
			}

			continue;
		}

		result.push(segment);
	}

	return (
		absolute
			? `/${result.join("/")}`
			: result.join("/") || "."
	) as string & Path;
}

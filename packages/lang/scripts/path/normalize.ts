import * as DString from "@scripts/string";
import type { Path } from "./constraints";

export function normalize(
	path: string,
): (string & Path) | null {
	if (path.includes("\0")) {
		return null;
	}

	let normalizedPath = path;

	if (DString.test(path, /^file:/i)) {
		try {
			const url = new URL(path);

			if (url.hostname !== "" || DString.test(url.pathname, /%2f/i)) {
				return null;
			}

			normalizedPath = decodeURIComponent(url.pathname);

			if (DString.includes(normalizedPath, "\0")) {
				return null;
			}
		} catch {
			return null;
		}
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

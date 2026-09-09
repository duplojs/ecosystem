import type { Path } from "./constraints";

export function normalize(
	path: string,
): (string & Path) | null {
	if (path.includes("\0")) {
		return null;
	}

	const absolute = path.startsWith("/");
	const result: string[] = [];

	for (const segment of path.split("/")) {
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

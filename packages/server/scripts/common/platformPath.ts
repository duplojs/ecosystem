import * as DPath from "@duplojs/lang/path";
import * as DString from "@duplojs/lang/string";
import * as DCommon from "@duplojs/lang/common";
import { currentOS, nodePath, OS } from "@scripts/implementor";

export function normalizePlatformPath(
	path: string,
): (string & DPath.Path) | null {
	if (currentOS.value === OS.windows) {
		if (
			DString.test(path, /^[\\/]{2}[?.][\\/]/)
			|| DString.test(path, /^file:\.?[\\/]/i)
		) {
			return null;
		}

		const normalizedPath = nodePath.value.win32.normalize(path);
		const separated = DString.replaceAll(normalizedPath, /\\/g, "/");

		if (DString.startsWith(separated, "//")) {
			const [, , server, share] = DString.split(separated, "/");

			if (!server || !share || !DPath.isSegment(server) || !DPath.isSegment(share)) {
				return null;
			}

			return DPath.normalize(DString.replace(separated, "//", "/UNC:/"));
		}

		if (DString.test(separated, /^[a-z]:\//i)) {
			return DPath.normalize(DString.replace(
				separated,
				/^[a-z]:/i,
				({ matchedValue }) => `/${DString.toUpperCase(matchedValue)}`,
			));
		}

		if (DString.startsWith(separated, "/") || DString.test(separated, /^[a-z]:/i)) {
			return null;
		}

		return DPath.normalize(separated);
	}

	return DPath.normalize(path);
}

export function toPlatformPath(
	path: DPath.AnyPath,
): string | null {
	if (currentOS.value !== OS.windows) {
		return path;
	}
	if (DString.includes(path, "\\")) {
		return null;
	}

	const platformPath = DString.replaceAll(path, /\//g, "\\");

	if (DString.test(path, /^\/[a-z]:(?:\/|$)/i)) {
		return DString.capitalize(DString.replace(platformPath, /^\\([a-z]:)\\?/i, "$1\\"));
	}

	if (DString.startsWith(path, "/UNC:/")) {
		const [, , server, share] = DString.split(path, "/");
		if (!server || !share || server === "?") {
			return null;
		}
		return DString.replace(platformPath, "\\UNC:\\", "\\\\");
	}

	if (DString.startsWith(path, "/") || DString.test(path, /^[a-z]:/i)) {
		return null;
	}
	return platformPath;
}

export class InvalidPlatformPathError extends DCommon.DuploJSError.parentClass("invalid-platform-path") {

}

export function normalizePlatformPathOrThrow(path: string): string & DPath.Path {
	const result = normalizePlatformPath(path);
	if (result === null) {
		throw new InvalidPlatformPathError(`Unrepresentable platform path: ${path}`);
	}
	return result;
}

export function toPlatformPathOrThrow(path: DPath.AnyPath): string {
	const result = toPlatformPath(path);
	if (result === null) {
		throw new InvalidPlatformPathError(`Unrepresentable virtual path: ${path}`);
	}
	return result;
}

import * as DPath from "@duplojs/lang/path";
import * as DString from "@duplojs/lang/string";
import * as DEither from "@duplojs/lang/either";
import * as DSCommon from "@scripts/common";
import { currentOS, OS } from "@scripts/implementor";

const absoluteNamespace = /^\/(?:DRV-[a-z]:|UNC:|DEVICE:)(?:\/|$)/i;
const driveSegment = /(^|\/)([a-z]:)(?=\/|$)/i;

function isNormalizedAbsolutePath(path: string): path is DPath.AnyPath {
	return DPath.isAbsolute(path)
		&& DString.test(path, absoluteNamespace)
		&& !DString.test(path, driveSegment);
}

function convertDriveSegments(path: string): string {
	return DString.replaceAll(
		path,
		driveSegment,
		({ groups }) => `${groups[0]}DRV-${DString.toUpperCase(groups[1]!)}`,
	);
}

function extractFilePath(path: string): string | null {
	try {
		const url = new URL(path);
		const pathname = decodeURIComponent(url.pathname);
		const result = url.hostname
			? `//${url.hostname}${pathname}`
			: pathname;

		return DString.replace(result, /^\/(?=[a-z]:(?:\/|$))/i, "");
	} catch {
		return null;
	}
}

function extractWindowsPath(path: string): string | null {
	const windowsPath = DString.replaceAll(path, /\\/g, "/");
	if (isNormalizedAbsolutePath(windowsPath)) {
		return windowsPath;
	}

	if (DString.startsWith(windowsPath, "//?/")) {
		const containedPath = DString.slice(windowsPath, 4, windowsPath.length);
		if (DString.test(containedPath, /^(?:Volume\{[^/]+\}|GLOBALROOT)(?:\/|$)/i)) {
			return extractWindowsPath(`//./${containedPath}`);
		}
		return extractWindowsPath(DString.replace(containedPath, /^UNC\//i, "//"));
	}

	if (DString.test(windowsPath, /^file:\/\//i)) {
		const containedPath = extractFilePath(windowsPath);
		return containedPath === null ? null : extractWindowsPath(containedPath);
	}

	return windowsPath;
}

function getCurrentDrive(): string | null {
	const directory = DSCommon.getCurrentWorkDirectory();
	if (DEither.isLeft(directory)) {
		return null;
	}

	const drive = DString.extract(DEither.unwrapRight(directory), /^\/DRV-([a-z]:)(?:\/|$)/i);
	return drive ? DString.toUpperCase(drive.groups[0]!) : null;
}

function attachCurrentDrive(path: string): string | null {
	if (!DString.startsWith(path, "/") || DString.test(path, absoluteNamespace)) {
		return path;
	}

	const drive = getCurrentDrive();
	return drive === null ? null : `/DRV-${drive}${path === "/" ? "" : path}`;
}

function convertWindowsPath(path: string): string | null {
	let absolutePath = path;
	if (DString.test(path, /^[a-z]:(?:\/|$)/i)) {
		absolutePath = `/${path}`;
	} else if (DString.startsWith(path, "//./")) {
		absolutePath = DString.replace(path, /^\/\/\.\//, "/DEVICE:/");
	} else if (DString.startsWith(path, "//")) {
		absolutePath = DString.replace(path, /^\/\//, "/UNC:/");
	}

	return attachCurrentDrive(convertDriveSegments(absolutePath));
}

export function normalize(path: string): DPath.AnyPath | null {
	if (currentOS.value !== OS.windows) {
		return DPath.normalize(path);
	}
	if (DString.includes(path, "\0")) {
		return null;
	}

	let extractedPath: string | null = null;
	try {
		extractedPath = extractWindowsPath(path);
	} catch {
		return null;
	}

	if (extractedPath === null || isNormalizedAbsolutePath(extractedPath)) {
		return extractedPath;
	}

	const convertedPath = convertWindowsPath(extractedPath);
	if (convertedPath === null) {
		return null;
	}

	const normalizedPath = DPath.normalize(convertedPath);
	if (normalizedPath === null) {
		return null;
	}

	// Parent traversal can remove the namespace folder and expose a bare root.
	const result = attachCurrentDrive(normalizedPath);
	return result === null ? null : DPath.normalize(result);
}

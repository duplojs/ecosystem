import type * as DPath from "@duplojs/lang/path";
import * as DEither from "@duplojs/lang/either";
import * as DString from "@duplojs/lang/string";
import * as DSCommon from "@scripts/common";
import { currentOS, OS } from "@scripts/implementor";

function getCurrentDrive(): string | undefined {
	const directory = DSCommon.getCurrentWorkDirectory();
	if (DEither.isLeft(directory)) {
		return undefined;
	}

	const drive = DString.extract(DEither.unwrapRight(directory), /^\/DRV-([a-z]:)(?:\/|$)/i);
	return drive ? DString.toUpperCase(drive.groups[0]!) : undefined;
}

function restoreDriveSegments(path: string): string {
	return DString.replaceAll(
		path,
		/(^|\/)DRV-([a-z]:)(?=\/|$)/i,
		({ groups }) => `${groups[0]}${DString.toUpperCase(groups[1]!)}`,
	);
}

function toUncPath(path: string): string | undefined {
	const [, , server, share] = DString.split(path, "/");
	if (!server || !share || server === "?") {
		return undefined;
	}

	return DString.replace(path, /^\/UNC:\//i, "//");
}

function toDevicePath(path: string): string | undefined {
	const device = DString.replace(path, /^\/DEVICE:(?:\/|$)/i, "");
	if (!device) {
		return undefined;
	}

	if (DString.test(device, /^(?:Volume\{[^/]+\}|GLOBALROOT)(?:\/|$)/i)) {
		const suffix = DString.test(device, /^Volume\{[^/]+\}$/i) ? "/" : "";
		return `//?/${device}${suffix}`;
	}

	return `//./${device}`;
}

function toWindowsPath(path: DPath.AnyPath): string | undefined {
	const restoredPath = restoreDriveSegments(path);
	if (DString.test(path, /^\/DRV-[a-z]:(?:\/|$)/i)) {
		const drivePath = DString.slice(restoredPath, 1, restoredPath.length);
		return DString.test(drivePath, /^[a-z]:$/i) ? `${drivePath}/` : drivePath;
	}
	if (DString.test(path, /^\/UNC:(?:\/|$)/i)) {
		return toUncPath(restoredPath);
	}
	if (DString.test(path, /^\/DEVICE:(?:\/|$)/i)) {
		return toDevicePath(restoredPath);
	}
	if (DString.startsWith(path, "/")) {
		const drive = getCurrentDrive();
		return drive === undefined ? undefined : `${drive}${restoredPath}`;
	}

	return restoredPath;
}

export function toPlatformPath(
	path: DPath.AnyPath,
): (
	| DEither.Success<string>
	| DEither.Left<"to-platform-path-error", DPath.AnyPath>
) {
	if (currentOS.value !== OS.windows) {
		return DEither.success(path);
	}

	const resolvedPath = toWindowsPath(path);
	if (resolvedPath === undefined) {
		return DEither.left("to-platform-path-error", path);
	}

	const sanitizedPath = DString.replaceAll(resolvedPath, /\\/g, "_");
	return DEither.success(DString.replaceAll(sanitizedPath, /\//g, "\\"));
}

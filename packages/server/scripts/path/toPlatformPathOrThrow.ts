import * as DCommon from "@duplojs/lang/common";
import * as DEither from "@duplojs/lang/either";
import type * as DPath from "@duplojs/lang/path";
import { toPlatformPath } from "./toPlatformPath";

export class InvalidPlatformPathError extends DCommon.DuploJSError.parentClass("invalid-platform-path") {

}

export function toPlatformPathOrThrow(path: DPath.AnyPath): string {
	const result = toPlatformPath(path);
	if (DEither.isLeft(result)) {
		throw new InvalidPlatformPathError(`Unrepresentable virtual path: ${path}`);
	}
	return DEither.unwrapRight(result);
}

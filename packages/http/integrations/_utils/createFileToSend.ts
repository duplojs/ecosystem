import * as DSPath from "@duplojs/server/path";
import * as DPath from "@duplojs/lang/path";
import * as DCommon from "@duplojs/lang/common";
import { readFile } from "node:fs/promises";

export async function createFileToSend(path: DPath.AnyPath, name?: string) {
	const blob = new Blob([await readFile(DSPath.toPlatformPathOrThrow(path)) as never]);

	return new File([blob], name ?? DPath.getBaseName(path) ?? "", {
		type: DCommon.mimeType.get(DPath.getExtensionName(path) ?? ""),
		lastModified: Date.now(),
	});
}

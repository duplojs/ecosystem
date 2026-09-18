import { type RoutePath } from "@core/route";
import * as DCommon from "@duplojs/lang/common";
import * as DString from "@duplojs/lang/string";

export function pathToRegExp(path: RoutePath) {
	return DCommon.pipe(
		path,
		DCommon.escapeRegExp,
		DString.replace(/\\\/$/g, ""),
		DString.replace(/\\\*/g, ".*"),
		DString.replace(
			/\\\{([A-Za-zÀ-ÿ0-9_-]+)\\\}/g,
			"(?<$1>[A-Za-zÀ-ÿ0-9_\\-. ]+)",
		),
		(regExp) => new RegExp(`^${regExp}\\/?$`),
	);
}

import * as DCommon from "@duplojs/lang/common";
import * as DArray from "@duplojs/lang/array";
import * as DObject from "@duplojs/lang/object";
import type { CacheControlDirectives } from "./types";
import * as DString from "@duplojs/lang/string";

export function createCacheControlResponseHeader(
	directives: CacheControlDirectives,
) {
	return DCommon.pipe(
		[
			DObject.entry("max-age", directives.maxAge),
			DObject.entry("s-maxage", directives.sMaxAge),
			DObject.entry("public", directives.public),
			DObject.entry("private", directives.private),
			DObject.entry("no-cache", directives.noCache),
			DObject.entry("no-store", directives.noStore),
			DObject.entry("no-transform", directives.noTransform),
			DObject.entry("must-revalidate", directives.mustRevalidate),
			DObject.entry("proxy-revalidate", directives.proxyRevalidate),
			DObject.entry("immutable", directives.immutable),
			DObject.entry("stale-while-revalidate", directives.staleWhileRevalidate),
			DObject.entry("stale-if-error", directives.staleIfError),
			DObject.entry("must-understand", directives.mustUnderstand),
		],
		DArray.concat(directives.extensions ? DObject.entries(directives.extensions) : []),
		DArray.reduce(
			DArray.reduceFrom<string[]>([]),
			({ element: [key, value], lastValue, nextPush, next }) => {
				if (
					value === true
				) {
					return nextPush(lastValue, key);
				} else if (
					typeof value === "number"
					&& Number.isFinite(value)
					&& value >= 0
				) {
					return nextPush(lastValue, `${key}=${Math.trunc(value)}`);
				} else if (
					value instanceof Array
					&& DArray.minElements(value, 1)
				) {
					return nextPush(lastValue, `${key}="${DString.join(value, ",")}"`);
				} else if (
					value !== ""
					&& typeof value === "string"
				) {
					return nextPush(lastValue, `${key}="${value}"`);
				} else {
					return next(lastValue);
				}
			},
		),
		DString.join(","),
	);
}

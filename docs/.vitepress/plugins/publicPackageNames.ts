import type { ShikiTransformer } from "shiki";

const versionedPackageNameRegex = /@duplojs-v\d+\//g;
const tsExpectErrorRegex = / ?@ts-expect-error/g;

export function replaceVersionedPackageNames(source: string): string {
	return source.replace(versionedPackageNameRegex, "@duplojs/");
}

export function removeTsExpectErrorDirectives(source: string): string {
	return source.replace(tsExpectErrorRegex, "");
}

export function normalizePublicCode(source: string): string {
	return removeTsExpectErrorDirectives(replaceVersionedPackageNames(source));
}

export function duplojsPublicPackageNames(): ShikiTransformer {
	return {
		name: "duplojs-public-package-names",
		span(node) {
			for (const child of node.children) {
				if (child.type !== "text") {
					continue;
				}

				child.value = normalizePublicCode(child.value);
			}
		},
	};
}

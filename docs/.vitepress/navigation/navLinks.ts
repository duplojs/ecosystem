import type { PageData } from "vitepress";

export function guideNavLink(page: PageData): string {
	const segments = page.relativePath.replace(/\.md$/, "").split("/");
	const [localeCandidate] = segments;
	const locale = localeCandidate && localeCandidate !== "index" ? localeCandidate : "fr";
	const version = /^v[0-9]+$/.test(segments[1] ?? "") ? segments[1] : "v1";

	return `/${locale}/${version}/guide/`;
}

export function apiNavLink(page: PageData): string {
	const segments = page.relativePath.replace(/\.md$/, "").split("/");
	const [localeCandidate] = segments;
	const locale = localeCandidate && localeCandidate !== "index" ? localeCandidate : "fr";
	const version = /^v[0-9]+$/.test(segments[1] ?? "") ? segments[1] : "v1";

	return `/${locale}/${version}/api/`;
}

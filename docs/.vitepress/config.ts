import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { defineConfig } from "vitepress";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";
import llmsTxtPlugin from "vitepress-plugin-llms";
import Typescript from "typescript";
import { locales } from "./locales";
import { createTwoslashCache, duplojsLlmsPlugin, duplojsMarkdownIncludePlugin, duplojsPublicPackageNames } from "./plugins";

const docsRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const version = "v1";
const hostname = "https://duplojs.dev";
const outDir = ".vitepress/dist";
const logo = "/images/logo.png";
const icon = "/images/logo.ico";
const socialImage = new URL(logo, hostname).toString();

export default defineConfig({
	title: "DuploJS",
	description: "Documentation de l'ecosysteme DuploJS.",
	cleanUrls: true,
	lastUpdated: true,
	base: "/",
	outDir,
	sitemap: {
		hostname,
	},
	locales,
	markdown: {
		lineNumbers: false,
		theme: {
			light: "light-plus",
			dark: "dark-plus",
		},
		languages: ["js", "jsx", "ts", "tsx", "vue"],
		config(md) {
			md.use(groupIconMdPlugin);
		},
		codeTransformers: [
			transformerTwoslash({
				explicitTrigger: true,
				typesCache: createTwoslashCache({
					root: docsRoot,
					cacheDir: ".vitepress/cache/twoslash",
				}),
				twoslashOptions: {
					customTags: ["annotate", "log", "warn", "error"],
					compilerOptions: {
						module: Typescript.ModuleKind.ESNext,
						moduleResolution: Typescript.ModuleResolutionKind.Bundler,
						moduleDetection: Typescript.ModuleDetectionKind.Force,
						allowArbitraryExtensions: true,
						strict: true,
						noImplicitAny: true,
						strictNullChecks: true,
						strictFunctionTypes: true,
						strictBindCallApply: true,
						strictPropertyInitialization: true,
						noImplicitThis: true,
						useUnknownInCatchVariables: true,
						alwaysStrict: true,
						noImplicitReturns: true,
						noUncheckedIndexedAccess: true,
						noImplicitOverride: true,
						types: [],
					},
				},
			}),
			duplojsPublicPackageNames(),
		],
	},
	vite: {
		resolve: {
			alias: {
				"@": docsRoot,
			},
		},
		optimizeDeps: {
			exclude: ["vitepress"],
		},
		plugins: [
			duplojsMarkdownIncludePlugin({
				root: docsRoot,
			}),
			groupIconVitePlugin(),
			llmsTxtPlugin({
				domain: hostname,
				ignoreFiles: ["index.md", "fr/index.md"],
				sidebar: locales.fr.themeConfig.sidebar,
				customTemplateVariables: {
					title: "DuploJS",
					description: "Documentation de l'ecosysteme DuploJS.",
				},
			}),
			duplojsLlmsPlugin({
				root: docsRoot,
				outDir,
			}),
		],
	},
	themeConfig: {
		logo,
		search: {
			provider: "local",
		},
		socialLinks: [
			{
				icon: "github",
				link: "https://github.com/duplojs/ecosystem",
			},
		],
	},
	head: [
		[
			"link",
			{
				rel: "icon",
				href: icon,
			},
		],
		[
			"meta",
			{
				property: "og:type",
				content: "website",
			},
		],
		[
			"meta",
			{
				property: "og:image",
				content: socialImage,
			},
		],
		[
			"meta",
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
		],
		[
			"meta",
			{
				name: "twitter:image",
				content: socialImage,
			},
		],
	],
});

export * from "./camelcase";
export * from "./dot-notation";
export * from "./no-unreachable-loop";
export * from "./prefer-destructuring";
export * from "./prefer-namespace-import";

import { camelcase } from "./camelcase";
import { dotNotation } from "./dot-notation";
import { noUnreachableLoop } from "./no-unreachable-loop";
import { preferDestructuring } from "./prefer-destructuring";
import { preferNamespaceImport } from "./prefer-namespace-import";

export const pluginRules = {
	camelcase,
	"dot-notation": dotNotation,
	"no-unreachable-loop": noUnreachableLoop,
	"prefer-destructuring": preferDestructuring,
	"prefer-namespace-import": preferNamespaceImport,
} as const;

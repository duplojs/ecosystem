import type * as DKind from "@duplojs/lang/kind";
import { createKind } from "@scripts/kind";

const importMetaKind = createKind("import-meta");

declare global {
	interface ImportMeta extends DKind.Kind<typeof importMetaKind> {}
}

export * from "./getCurrentDirectoryName";

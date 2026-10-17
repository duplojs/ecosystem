import type * as DKind from "@duplojs/lang/kind";
declare const importMetaKind: DKind.Handler<DKind.Definition<"@DuplojsServer/import-meta", unknown>>;
declare global {
    interface ImportMeta extends DKind.Kind<typeof importMetaKind> {
    }
}
export * from './getCurrentDirectoryName';

export interface MimeTypeStore {
    get(extensionName: string): string | undefined;
    set(extensionName: string, mimeType: string): void;
}
export declare const mimeType: MimeTypeStore;

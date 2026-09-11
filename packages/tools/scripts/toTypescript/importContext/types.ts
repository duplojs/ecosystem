export interface MapImportContextValue {
	namespace?: readonly string[];
	default?: readonly string[];
	direct?: readonly string[];
}

export type MapImportContext = Map<string, MapImportContextValue>;

export type ImportKind = "default" | "namespace" | "direct";

export interface DocumentationVersion {
	name: string;
	label: string;
}

export const documentationVersions = [
	{
		name: "v1",
		label: "v1.x (LTS)",
	},
] as const satisfies DocumentationVersion[];

export type DocumentationVersionName = typeof documentationVersions[number]["name"];

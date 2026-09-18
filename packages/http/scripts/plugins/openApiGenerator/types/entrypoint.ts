import { type DataStructureToJsonSchema } from "@duplojs/tools";

export interface EntrypointParameter {
	name: string;
	in: "path" | "query" | "header";
	required: boolean;
	schema: DataStructureToJsonSchema.JsonSchema;
}

export interface EntrypointContentBodyApplicationJson {
	"application/json": {
		schema: DataStructureToJsonSchema.JsonSchema;
	};
}

export interface EntrypointContentBodyFormData {
	"multipart/form-data": {
		schema: DataStructureToJsonSchema.JsonSchema;
	};
}

export interface EntrypointContentBodyTextPlain {
	"text/plain": {
		schema: DataStructureToJsonSchema.JsonSchema;
	};
}

export type EntrypointContentBody = (
	| EntrypointContentBodyApplicationJson
	| EntrypointContentBodyTextPlain
	| EntrypointContentBodyFormData
);

export interface EntrypointRequestBody {
	required: true;
	content: EntrypointContentBody;
}

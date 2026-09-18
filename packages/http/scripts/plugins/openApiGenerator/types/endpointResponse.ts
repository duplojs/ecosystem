import type { DataStructureToJsonSchema } from "@duplojs/tools";

export interface EndpointResponseHeader {
	information: {
		schema: DataStructureToJsonSchema.JsonSchema;
		description: string;
	};
}

export interface EndpointResponseContent {
	"text/event-stream"?: {
		itemSchema: DataStructureToJsonSchema.JsonSchema;
	};
	"application/json"?: {
		schema: DataStructureToJsonSchema.JsonSchema;
	};
	"text/plain"?: {
		schema: DataStructureToJsonSchema.JsonSchema;
	};
	"application/octet-stream"?: {
		schema: DataStructureToJsonSchema.JsonSchema;
	};
}

export interface EndpointResponse {
	description?: string;
	headers: EndpointResponseHeader;
	content?: EndpointResponseContent;
}

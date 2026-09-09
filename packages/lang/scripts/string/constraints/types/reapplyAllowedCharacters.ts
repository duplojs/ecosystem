import type { AllowedCharacters, ExtractAllowedCharacters } from "../allowedCharacters";

export type ReapplyAllowedCharacters<
	GenericSource extends string,
	GenericOutput extends string,
> = ExtractAllowedCharacters<
	GenericSource,
	unknown
> extends infer InferredAllowedCharacters extends AllowedCharacters<any>
	? GenericOutput & InferredAllowedCharacters
	: GenericOutput;

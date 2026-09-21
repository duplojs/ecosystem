import { type ExtractShapeCodecs } from "@core/steps";
import * as DDataStructure from "@duplojs/lang/dataStructure";

export const defaultExtractShapeCodecs: ExtractShapeCodecs = {
	query: DDataStructure.codecsString,
	params: DDataStructure.codecsString,
	headers: DDataStructure.codecsString,
};
